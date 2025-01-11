#pragma once
#include <QString>
#include <QObject>
#include <QtNetwork/QNetworkAccessManager>
#include <QtNetwork/QNetworkReply>

class Database : public QObject {
    Q_OBJECT

public:
    static Database& getInstance() {
        static Database instance;
        return instance;
    }

    void initialize();
    void signIn(const QString& phone, const QString& password);
    void sendMessage(const QString& content);
    void fetchMessages();

signals:
    void signInSuccess();
    void signInError(const QString& error);
    void messagesReceived(const QStringList& messages);

private:
    Database() : networkManager(new QNetworkAccessManager(this)) {}
    Database(const Database&) = delete;
    Database& operator=(const Database&) = delete;

    QNetworkAccessManager* networkManager;
    QString supabaseUrl = "https://byjyyshxviieqkymavnh.supabase.co";
    QString supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5anl5c2h4dmlpZXFreW1hdm5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYwMjQ1ODMsImV4cCI6MjA1MTYwMDU4M30.iP1Tlz7tnwO9GDY4oW12fN8IwImcjkoLpBhdsCq1VwM";

private slots:
    void handleNetworkReply(QNetworkReply* reply);
};