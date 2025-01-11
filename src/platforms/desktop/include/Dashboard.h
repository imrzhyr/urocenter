#pragma once
#include <QWidget>
#include <QVBoxLayout>
#include <QPushButton>
#include <QLabel>
#include "Database.h"

class Dashboard : public QWidget {
    Q_OBJECT

public:
    Dashboard(QWidget *parent = nullptr);

signals:
    void chatSelected();

private slots:
    void onMessagesCardClicked();
    void onReportsCardClicked();
    void fetchUserData();

private:
    void setupUI();
    void createCard(QWidget* card, const QString& title, const QString& subtitle);

    QVBoxLayout* mainLayout;
    QWidget* messagesCard;
    QWidget* reportsCard;
    QWidget* appointmentCard;
    QWidget* healthTipsCard;
};
