#include "Dashboard.h"
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QPushButton>
#include <QLabel>
#include "Database.h"

Dashboard::Dashboard(QWidget *parent) : QWidget(parent) {
    setupUI();
    fetchUserData();
}

void Dashboard::setupUI() {
    mainLayout = new QVBoxLayout(this);
    mainLayout->setSpacing(16);
    mainLayout->setContentsMargins(16, 16, 16, 16);

    messagesCard = new QWidget(this);
    reportsCard = new QWidget(this);
    appointmentCard = new QWidget(this);
    healthTipsCard = new QWidget(this);

    createCard(messagesCard, "Messages", "Connect with Dr. Ali Kamal");
    createCard(reportsCard, "Medical Reports", "View and manage your reports");
    createCard(appointmentCard, "Appointments", "Schedule a consultation");
    createCard(healthTipsCard, "Health Tips", "Daily health advice");

    mainLayout->addWidget(messagesCard);
    mainLayout->addWidget(reportsCard);
    mainLayout->addWidget(appointmentCard);
    mainLayout->addWidget(healthTipsCard);

    messagesCard->setCursor(Qt::PointingHandCursor);
    reportsCard->setCursor(Qt::PointingHandCursor);

    connect(messagesCard, &QWidget::clicked, this, &Dashboard::onMessagesCardClicked);
    connect(reportsCard, &QWidget::clicked, this, &Dashboard::onReportsCardClicked);
}

void Dashboard::createCard(QWidget* card, const QString& title, const QString& subtitle) {
    QVBoxLayout* layout = new QVBoxLayout(card);
    
    QLabel* titleLabel = new QLabel(title, card);
    titleLabel->setStyleSheet("font-size: 18px; font-weight: bold;");
    
    QLabel* subtitleLabel = new QLabel(subtitle, card);
    subtitleLabel->setStyleSheet("color: #666;");
    
    layout->addWidget(titleLabel);
    layout->addWidget(subtitleLabel);
    
    card->setStyleSheet(
        "QWidget {"
        "   background-color: white;"
        "   border-radius: 8px;"
        "   padding: 16px;"
        "   border: 1px solid #eee;"
        "}"
        "QWidget:hover {"
        "   background-color: #f5f5f5;"
        "}"
    );
}

void Dashboard::onMessagesCardClicked() {
    emit chatSelected();
}

void Dashboard::onReportsCardClicked() {
    // Show reports dialog
}

void Dashboard::fetchUserData() {
    Database::getInstance().fetchUserProfile([this](const QJsonObject& profile) {
        // Update UI with profile data
    });
}