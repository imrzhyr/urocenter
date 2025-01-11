#ifndef SIGNIN_H
#define SIGNIN_H

#include <QWidget>
#include <QLabel>
#include <QVBoxLayout>
#include <QLineEdit>
#include <QPushButton>
#include <QMessageBox>
#include "Database.h"

class SignIn : public QWidget {
    Q_OBJECT

public:
    SignIn(QWidget *parent = nullptr);

private:
    void setupUI();
    void connectSignals();

private slots:
    void handleSignIn();
    void onSignInSuccess();
    void onSignInError(const QString& error);

private:
    QLabel *titleLabel;
    QLineEdit *phoneInput;
    QLineEdit *passwordInput;
    QPushButton *signInButton;
    QVBoxLayout *layout;
};

#endif
