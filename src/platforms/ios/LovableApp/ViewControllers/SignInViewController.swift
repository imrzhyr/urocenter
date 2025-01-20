import UIKit
import Supabase

class SignInViewController: UIViewController {
    private let titleLabel: UILabel = {
        let label = UILabel()
        label.text = "Sign In"
        label.font = .systemFont(ofSize: 24, weight: .bold)
        label.textAlignment = .center
        return label
    }()
    
    private let phoneTextField: UITextField = {
        let textField = UITextField()
        textField.placeholder = "Phone Number"
        textField.borderStyle = .roundedRect
        textField.keyboardType = .phonePad
        return textField
    }()
    
    private let passwordTextField: UITextField = {
        let textField = UITextField()
        textField.placeholder = "Password"
        textField.borderStyle = .roundedRect
        textField.isSecureTextEntry = true
        return textField
    }()
    
    private let signInButton: UIButton = {
        let button = UIButton(type: .system)
        button.setTitle("Sign In", for: .normal)
        button.backgroundColor = UIColor(red: 124/255, green: 58/255, blue: 237/255, alpha: 1)
        button.setTitleColor(.white, for: .normal)
        button.layer.cornerRadius = 8
        return button
    }()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        signInButton.addTarget(self, action: #selector(handleSignIn), for: .touchUpInside)
    }
    
    private func setupUI() {
        view.backgroundColor = .white
        
        let stackView = UIStackView(arrangedSubviews: [
            titleLabel,
            phoneTextField,
            passwordTextField,
            signInButton
        ])
        stackView.axis = .vertical
        stackView.spacing = 16
        stackView.translatesAutoresizingMaskIntoConstraints = false
        
        view.addSubview(stackView)
        
        NSLayoutConstraint.activate([
            stackView.centerYAnchor.constraint(equalTo: view.centerYAnchor),
            stackView.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 24),
            stackView.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -24),
            signInButton.heightAnchor.constraint(equalToConstant: 44)
        ])
    }
    
    @objc private func handleSignIn() {
        guard let phone = phoneTextField.text, !phone.isEmpty,
              let password = passwordTextField.text, !password.isEmpty else {
            showAlert(message: "Please fill in all fields")
            return
        }
        
        Task {
            do {
                let query = AppDelegate.supabase.database
                    .from("profiles")
                    .select()
                    .eq("phone", value: phone)
                    .eq("password", value: password)
                    .single()
                
                let profile: Profile = try await query.execute().value
                
                DispatchQueue.main.async {
                    UserDefaults.standard.set(phone, forKey: "userPhone")
                    NavigationManager.shared.navigateToDashboard(from: self)
                }
            } catch {
                DispatchQueue.main.async {
                    self.showAlert(message: "Invalid credentials")
                }
            }
        }
    }
    
    private func showAlert(message: String) {
        let alert = UIAlertController(
            title: "Error",
            message: message,
            preferredStyle: .alert
        )
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }
}

struct Profile: Codable {
    let id: String
    let phone: String
    let role: String
}
