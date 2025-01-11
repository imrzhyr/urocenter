import UIKit
import Supabase

class ChatViewController: UIViewController {
    private let tableView = UITableView()
    private let messageInput = UITextField()
    private let sendButton = UIButton()
    private var messages: [Message] = []
    private var messageSubscription: RealtimeSubscription?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupViews()
        subscribeToMessages()
    }
    
    private func setupViews() {
        view.backgroundColor = .systemBackground
        
        tableView.translatesAutoresizingMaskIntoConstraints = false
        tableView.delegate = self
        tableView.dataSource = self
        tableView.register(MessageCell.self, forCellReuseIdentifier: "MessageCell")
        
        messageInput.translatesAutoresizingMaskIntoConstraints = false
        messageInput.placeholder = "Type a message..."
        messageInput.borderStyle = .roundedRect
        
        sendButton.translatesAutoresizingMaskIntoConstraints = false
        sendButton.setTitle("Send", for: .normal)
        sendButton.setTitleColor(.systemBlue, for: .normal)
        sendButton.addTarget(self, action: #selector(sendMessage), for: .touchUpInside)
        
        let inputStack = UIStackView(arrangedSubviews: [messageInput, sendButton])
        inputStack.translatesAutoresizingMaskIntoConstraints = false
        inputStack.spacing = 8
        
        view.addSubview(tableView)
        view.addSubview(inputStack)
        
        NSLayoutConstraint.activate([
            tableView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            tableView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            
            inputStack.topAnchor.constraint(equalTo: tableView.bottomAnchor, constant: 8),
            inputStack.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 16),
            inputStack.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -16),
            inputStack.bottomAnchor.constraint(equalTo: view.keyboardLayoutGuide.topAnchor, constant: -8),
            
            messageInput.heightAnchor.constraint(equalToConstant: 40),
            sendButton.widthAnchor.constraint(equalToConstant: 60)
        ])
    }
    
    private func subscribeToMessages() {
        Task {
            do {
                let messagesResponse = try await AppDelegate.supabase.database
                    .from("messages")
                    .select()
                    .order("created_at")
                    .execute()
                
                messages = messagesResponse.value
                tableView.reloadData()
                scrollToBottom()
                
                messageSubscription = AppDelegate.supabase.realtime
                    .channel("public:messages")
                    .on("INSERT") { [weak self] message in
                        self?.handleNewMessage(message)
                    }
                    .subscribe()
            } catch {
                showError("Failed to load messages")
            }
        }
    }
    
    @objc private func sendMessage() {
        guard let content = messageInput.text?.trimmingCharacters(in: .whitespacesAndNewlines),
              !content.isEmpty else { return }
        
        Task {
            do {
                try await AppDelegate.supabase.database
                    .from("messages")
                    .insert(Message(
                        content: content,
                        userId: getCurrentUserId(),
                        isFromDoctor: false
                    ))
                    .execute()
                
                messageInput.text = ""
            } catch {
                showError("Failed to send message")
            }
        }
    }
}