#include "SignIn.h"
#include "Database.h"
#include <QVBoxLayout>
#include <QLineEdit>
#include <QPushButton>
#include <QLabel>
#include <QMessageBox>

SignIn::SignIn(QWidget *parent) : QWidget(parent) {
    setupUI();
    connectSignals();
}

void SignIn::setupUI() {
    auto layout = new QVBoxLayout(this);
    
    auto titleLabel = new QLabel("Sign In", this);
    titleLabel->setStyleSheet("font-size: 24px; font-weight: bold;");
    layout->addWidget(titleLabel, 0, Qt::AlignCenter);

    phoneInput = new QLineEdit(this);
    phoneInput->setPlaceholderText("Phone Number");
    layout->addWidget(phoneInput);

    passwordInput = new QLineEdit(this);
    passwordInput->setPlaceholderText("Password");
    passwordInput->setEchoMode(QLineEdit::Password);
    layout->addWidget(passwordInput);

    signInButton = new QPushButton("Sign In", this);
    signInButton->setStyleSheet("background-color: #7c3aed; color: white; padding: 10px;");
    layout->addWidget(signInButton);

    layout->addStretch();
    setLayout(layout);
}

void SignIn::connectSignals() {
    connect(signInButton, &QPushButton::clicked, this, &SignIn::handleSignIn);
    connect(&Database::getInstance(), &Database::signInSuccess, this, &SignIn::onSignInSuccess);
    connect(&Database::getInstance(), &Database::signInError, this, &SignIn::onSignInError);
}

void SignIn::handleSignIn() {
    QString phone = phoneInput->text();
    QString password = passwordInput->text();
    
    if (phone.isEmpty() || password.isEmpty()) {
        QMessageBox::warning(this, "Error", "Please fill in all fields");
        return;
    }

    Database::getInstance().signIn(phone, password);
}

void SignIn::onSignInSuccess() {
    emit signInSuccessful();
}

void SignIn::onSignInError(const QString& error) {
    QMessageBox::critical(this, "Error", error);
}