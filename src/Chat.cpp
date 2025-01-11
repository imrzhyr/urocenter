#include "Chat.h"
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QListWidgetItem>
#include "Database.h"

Chat::Chat(QWidget *parent) : QWidget(parent) {
    setupUI();
    subscribeToMessages();
}

void Chat::setupUI() {
    mainLayout = new QVBoxLayout(this);
    mainLayout->setSpacing(8);
    mainLayout->setContentsMargins(16, 16, 16, 16);

    messagesList = new QListWidget(this);
    messagesList->setStyleSheet(
        "QListWidget {"
        "   background-color: white;"
        "   border-radius: 8px;"
        "   border: 1px solid #eee;"
        "}"
    );

    QHBoxLayout* inputLayout = new QHBoxLayout();
    messageInput = new QLineEdit(this);
    messageInput->setPlaceholderText("Type a message...");
    messageInput->setStyleSheet(
        "QLineEdit {"
        "   padding: 8px;"
        "   border-radius: 4px;"
        "   border: 1px solid #ddd;"
        "}"
    );

    sendButton = new QPushButton("Send", this);
    sendButton->setStyleSheet(
        "QPushButton {"
        "   background-color: #7c3aed;"
        "   color: white;"
        "   padding: 8px 16px;"
        "   border-radius: 4px;"
        "}"
        "QPushButton:hover {"
        "   background-color: #6d28d9;"
        "}"
    );

    inputLayout->addWidget(messageInput);
    inputLayout->addWidget(sendButton);

    mainLayout->addWidget(messagesList);
    mainLayout->addLayout(inputLayout);

    connect(sendButton, &QPushButton::clicked, this, &Chat::sendMessage);
    connect(messageInput, &QLineEdit::returnPressed, this, &Chat::sendMessage);
}

void Chat::sendMessage() {
    QString content = messageInput->text().trimmed();
    if (content.isEmpty()) return;

    Database::getInstance().sendMessage(content);
    messageInput->clear();
}

void Chat::onNewMessage(const QString& message) {
    QListWidgetItem* item = new QListWidgetItem(message);
    messagesList->addItem(item);
    messagesList->scrollToBottom();
}

void Chat::subscribeToMessages() {
    Database::getInstance().subscribeToMessages([this](const QString& message) {
        onNewMessage(message);
    });
}