import UIKit
import Supabase

class DashboardViewController: UIViewController {
    private let messagesCard = UIView()
    private let reportsCard = UIView()
    private let appointmentCard = UIView()
    private let healthTipsCard = UIView()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupViews()
        fetchUserData()
    }
    
    private func setupViews() {
        view.backgroundColor = .systemBackground
        
        let stackView = UIStackView()
        stackView.axis = .vertical
        stackView.spacing = 16
        stackView.translatesAutoresizingMaskIntoConstraints = false
        
        [messagesCard, reportsCard, appointmentCard, healthTipsCard].forEach { card in
            card.backgroundColor = .secondarySystemBackground
            card.layer.cornerRadius = 12
            card.layer.shadowColor = UIColor.black.cgColor
            card.layer.shadowOpacity = 0.1
            card.layer.shadowOffset = CGSize(width: 0, height: 2)
            card.layer.shadowRadius = 4
            
            stackView.addArrangedSubview(card)
        }
        
        view.addSubview(stackView)
        
        NSLayoutConstraint.activate([
            stackView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 16),
            stackView.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 16),
            stackView.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -16)
        ])
        
        messagesCard.addGestureRecognizer(UITapGestureRecognizer(target: self, action: #selector(navigateToChat)))
        reportsCard.addGestureRecognizer(UITapGestureRecognizer(target: self, action: #selector(showReportsDialog)))
    }
    
    private func fetchUserData() {
        Task {
            do {
                let profile = try await AppDelegate.supabase.database
                    .from("profiles")
                    .select()
                    .eq("id", getCurrentUserId())
                    .single()
                    .execute()
                    .value
                
                await MainActor.run {
                    updateUI(with: profile)
                }
            } catch {
                showError("Failed to load profile")
            }
        }
    }
    
    @objc private func navigateToChat() {
        NavigationManager.shared.navigateToChat(from: self, userId: getCurrentUserId())
    }
    
    @objc private func showReportsDialog() {
        let reportsVC = MedicalReportsViewController()
        present(reportsVC, animated: true)
    }
}
