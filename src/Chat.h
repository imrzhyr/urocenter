#pragma once
#include <QWidget>
#include <QVBoxLayout>
#include <QListWidget>
#include <QLineEdit>
#include <QPushButton>
#include "Database.h"

class Chat : public QWidget {
    Q_OBJECT

public:
    Chat(QWidget *parent = nullptr);

private slots:
    void sendMessage();
    void onNewMessage(const QString& message);

private:
    void setupUI();
    void subscribeToMessages();

    QVBoxLayout* mainLayout;
    QListWidget* messagesList;
    QLineEdit* messageInput;
    QPushButton* sendButton;
};