// UmaRock AI - Main Application Logic
class UmaRockAI {
    constructor() {
        this.currentChatId = null;
        this.currentModel = 'deepseek-r1-free';
        this.isAuthenticated = false;
        this.user = null;
        this.chatHistory = [];
        this.messages = [];
        this.isLoading = false;
        this.backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
        
        this.init();
    }

    async init() {
        this.initializeElements();
        this.bindEvents();
        await this.loadModels();
        await this.checkAuthState();
        this.loadChatHistory();
        this.applyTheme();
    }

    initializeElements() {
        // Get DOM elements
        this.elements = {
            themeSelect: document.getElementById('themeSelect'),
            authBtn: document.getElementById('authBtn'),
            authText: document.getElementById('authText'),
            newChatBtn: document.getElementById('newChatBtn'),
            modelSelect: document.getElementById('modelSelect'),
            messagesContainer: document.getElementById('messagesContainer'),
            messageInput: document.getElementById('messageInput'),
            sendBtn: document.getElementById('sendBtn'),
            regenerateBtn: document.getElementById('regenerateBtn'),
            chatHistory: document.getElementById('chatHistory'),
            exportChatBtn: document.getElementById('exportChatBtn'),
            supportBtn: document.getElementById('supportBtn'),
            aboutBtn: document.getElementById('aboutBtn'),
            pinChatBtn: document.getElementById('pinChatBtn'),
            bookmarkBtn: document.getElementById('bookmarkBtn'),
            favoriteBtn: document.getElementById('favoriteBtn'),
            creditsModal: document.getElementById('creditsModal'),
            exportModal: document.getElementById('exportModal'),
            closeCredits: document.getElementById('closeCredits'),
            closeExport: document.getElementById('closeExport'),
            exportPDF: document.getElementById('exportPDF'),
            exportDOCX: document.getElementById('exportDOCX'),
            exportTXT: document.getElementById('exportTXT')
        };
    }

    bindEvents() {
        // Theme switching
        this.elements.themeSelect.addEventListener('change', (e) => {
            this.setTheme(e.target.value);
        });

        // Authentication
        this.elements.authBtn.addEventListener('click', () => {
            if (this.isAuthenticated) {
                this.signOut();
            } else {
                window.location.href = 'auth.html';
            }
        });

        // New chat
        this.elements.newChatBtn.addEventListener('click', () => {
            this.createNewChat();
        });

        // Model selection
        this.elements.modelSelect.addEventListener('change', (e) => {
            this.currentModel = e.target.value;
        });

        // Message sending
        this.elements.sendBtn.addEventListener('click', () => {
            this.sendMessage();
        });

        this.elements.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Regenerate response
        this.elements.regenerateBtn.addEventListener('click', () => {
            this.regenerateLastResponse();
        });

        // Export functionality
        this.elements.exportChatBtn.addEventListener('click', () => {
            this.showExportModal();
        });

        // Support and about
        this.elements.supportBtn.addEventListener('click', () => {
            this.openSupportChat();
        });

        this.elements.aboutBtn.addEventListener('click', () => {
            this.showCreditsModal();
        });

        // Chat actions
        this.elements.pinChatBtn.addEventListener('click', () => {
            this.togglePinChat();
        });

        this.elements.bookmarkBtn.addEventListener('click', () => {
            this.toggleBookmark();
        });

        this.elements.favoriteBtn.addEventListener('click', () => {
            this.toggleFavorite();
        });

        // Modal controls
        this.elements.closeCredits.addEventListener('click', () => {
            this.hideCreditsModal();
        });

        this.elements.closeExport.addEventListener('click', () => {
            this.hideExportModal();
        });

        this.elements.exportPDF.addEventListener('click', () => {
            this.exportChat('pdf');
        });

        this.elements.exportDOCX.addEventListener('click', () => {
            this.exportChat('docx');
        });

        this.elements.exportTXT.addEventListener('click', () => {
            this.exportChat('txt');
        });

        // Auto-resize textarea
        this.elements.messageInput.addEventListener('input', () => {
            this.autoResizeTextarea();
        });
    }

    async loadModels() {
        try {
            const response = await fetch(`${this.backendUrl}/api/models`);
            const models = await response.json();
            
            this.elements.modelSelect.innerHTML = '';
            models.forEach(model => {
                const option = document.createElement('option');
                option.value = model.id;
                option.textContent = model.name;
                if (model.status === 'coming-soon') {
                    option.disabled = true;
                    option.textContent += ' (Coming Soon)';
                }
                this.elements.modelSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Failed to load models:', error);
            // Fallback models
            const fallbackModels = [
                { id: 'deepseek-r1-free', name: 'DeepSeek R1 Free' },
                { id: 'deepseek-r1-0528', name: 'DeepSeek R1 0528' }
            ];
            
            this.elements.modelSelect.innerHTML = '';
            fallbackModels.forEach(model => {
                const option = document.createElement('option');
                option.value = model.id;
                option.textContent = model.name;
                this.elements.modelSelect.appendChild(option);
            });
        }
    }

    async checkAuthState() {
        // Mock authentication state - in production, this would check Firebase auth
        const token = localStorage.getItem('authToken');
        if (token) {
            this.isAuthenticated = true;
            this.user = JSON.parse(localStorage.getItem('user') || '{}');
            this.elements.authText.textContent = 'Sign Out';
        } else {
            this.isAuthenticated = false;
            this.elements.authText.textContent = 'Sign In';
        }
    }

    async signOut() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        this.isAuthenticated = false;
        this.user = null;
        this.elements.authText.textContent = 'Sign In';
        window.location.reload();
    }

    createNewChat() {
        this.currentChatId = this.generateChatId();
        this.messages = [];
        this.elements.messagesContainer.innerHTML = `
            <div class="text-center text-gray-400 py-8">
                <i class="fas fa-robot text-4xl mb-4"></i>
                <h2 class="text-xl font-semibold mb-2">New Chat</h2>
                <p class="text-sm">Start a conversation with our advanced AI models</p>
            </div>
        `;
        this.saveChatToHistory();
    }

    async sendMessage() {
        const message = this.elements.messageInput.value.trim();
        if (!message || this.isLoading) return;

        if (!this.isAuthenticated) {
            alert('Please sign in to chat with AI models.');
            return;
        }

        // Add user message
        this.addMessage(message, 'user');
        this.elements.messageInput.value = '';
        this.autoResizeTextarea();

        // Show loading
        this.isLoading = true;
        this.showLoadingMessage();

        try {
            const response = await fetch(`${this.backendUrl}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({
                    model: this.currentModel,
                    messages: this.getMessagesForAPI(),
                    stream: true,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            await this.handleStreamingResponse(response);
        } catch (error) {
            console.error('Error sending message:', error);
            this.hideLoadingMessage();
            this.addMessage('Sorry, I encountered an error. Please try again.', 'assistant');
        }

        this.isLoading = false;
    }

    async handleStreamingResponse(response) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let aiMessage = '';
        let messageElement = null;

        this.hideLoadingMessage();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(line => line.trim());

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    
                    if (data === '[DONE]') continue;
                    
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.content) {
                            aiMessage += parsed.content;
                            if (!messageElement) {
                                messageElement = this.addMessage('', 'assistant');
                            }
                            this.updateMessageContent(messageElement, aiMessage);
                        }
                    } catch (e) {
                        // Skip invalid JSON
                    }
                }
            }
        }

        if (aiMessage) {
            this.saveCurrentChat();
        }
    }

    addMessage(content, role) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role} fade-in p-4 rounded-lg max-w-4xl mx-auto`;
        
        const avatar = document.createElement('div');
        avatar.className = 'inline-block mr-3';
        avatar.innerHTML = role === 'user' ? 
            '<i class="fas fa-user"></i>' : 
            '<i class="fas fa-robot"></i>';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'inline-block align-top';
        contentDiv.innerHTML = this.formatMessage(content);

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(contentDiv);

        this.elements.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();

        // Add to messages array
        this.messages.push({ role, content, timestamp: Date.now() });

        return messageDiv;
    }

    updateMessageContent(messageElement, content) {
        const contentDiv = messageElement.querySelector('.inline-block.align-top');
        contentDiv.innerHTML = this.formatMessage(content);
    }

    formatMessage(content) {
        // Format code blocks
        content = content.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            return `<div class="code-block">
                <button class="copy-btn" onclick="navigator.clipboard.writeText('${code.replace(/'/g, "\\'")}')">
                    <i class="fas fa-copy"></i> Copy
                </button>
                <pre><code>${this.escapeHtml(code)}</code></pre>
            </div>`;
        });

        // Format inline code
        content = content.replace(/`([^`]+)`/g, '<code class="bg-gray-600 px-1 py-0.5 rounded text-sm">$1</code>');

        // Format bold and italic
        content = content.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        content = content.replace(/\*([^*]+)\*/g, '<em>$1</em>');

        // Convert newlines to <br>
        content = content.replace(/\n/g, '<br>');

        return content;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showLoadingMessage() {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loadingMessage';
        loadingDiv.className = 'message assistant fade-in p-4 rounded-lg max-w-4xl mx-auto';
        loadingDiv.innerHTML = `
            <div class="inline-block mr-3">
                <i class="fas fa-robot"></i>
            </div>
            <div class="inline-block align-top">
                <span class="loading-dots">Thinking</span>
            </div>
        `;
        this.elements.messagesContainer.appendChild(loadingDiv);
        this.scrollToBottom();
    }

    hideLoadingMessage() {
        const loadingMessage = document.getElementById('loadingMessage');
        if (loadingMessage) {
            loadingMessage.remove();
        }
    }

    regenerateLastResponse() {
        if (this.messages.length < 2) return;

        // Remove last assistant message and user message
        this.messages.splice(-2);
        this.renderMessages();

        // Send the last user message again
        const lastUserMessage = this.messages[this.messages.length - 1];
        if (lastUserMessage && lastUserMessage.role === 'user') {
            this.sendMessage();
        }
    }

    renderMessages() {
        this.elements.messagesContainer.innerHTML = '';
        this.messages.forEach(message => {
            this.addMessage(message.content, message.role);
        });
    }

    getMessagesForAPI() {
        return this.messages.map(msg => ({
            role: msg.role,
            content: msg.content
        }));
    }

    scrollToBottom() {
        this.elements.messagesContainer.scrollTop = this.elements.messagesContainer.scrollHeight;
    }

    autoResizeTextarea() {
        const textarea = this.elements.messageInput;
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }

    // Chat history management
    loadChatHistory() {
        const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
        this.chatHistory = history;
        this.renderChatHistory();
    }

    saveChatToHistory() {
        if (!this.currentChatId || this.messages.length === 0) return;

        const chat = {
            id: this.currentChatId,
            title: this.generateChatTitle(),
            messages: [...this.messages],
            model: this.currentModel,
            timestamp: Date.now(),
            pinned: false,
            bookmarked: false,
            favorite: false
        };

        const existingIndex = this.chatHistory.findIndex(c => c.id === this.currentChatId);
        if (existingIndex >= 0) {
            this.chatHistory[existingIndex] = chat;
        } else {
            this.chatHistory.unshift(chat);
        }

        localStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));
        this.renderChatHistory();
    }

    saveCurrentChat() {
        this.saveChatToHistory();
    }

    renderChatHistory() {
        this.elements.chatHistory.innerHTML = '';
        
        this.chatHistory.slice(0, 10).forEach(chat => {
            const chatItem = document.createElement('div');
            chatItem.className = 'p-3 rounded-lg hover:bg-gray-700 cursor-pointer text-sm';
            chatItem.innerHTML = `
                <div class="flex items-center justify-between">
                    <div class="flex-1 truncate">
                        <div class="font-medium">${chat.title}</div>
                        <div class="text-xs text-gray-400">${new Date(chat.timestamp).toLocaleDateString()}</div>
                    </div>
                    <div class="flex space-x-1">
                        ${chat.pinned ? '<i class="fas fa-thumbtack text-xs text-blue-400"></i>' : ''}
                        ${chat.bookmarked ? '<i class="fas fa-bookmark text-xs text-yellow-400"></i>' : ''}
                        ${chat.favorite ? '<i class="fas fa-heart text-xs text-red-400"></i>' : ''}
                    </div>
                </div>
            `;
            
            chatItem.addEventListener('click', () => {
                this.loadChat(chat.id);
            });
            
            this.elements.chatHistory.appendChild(chatItem);
        });
    }

    loadChat(chatId) {
        const chat = this.chatHistory.find(c => c.id === chatId);
        if (!chat) return;

        this.currentChatId = chatId;
        this.currentModel = chat.model;
        this.messages = [...chat.messages];
        
        this.elements.modelSelect.value = this.currentModel;
        this.renderMessages();
        
        // Update chat actions
        this.updateChatActions();
    }

    generateChatId() {
        return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateChatTitle() {
        if (this.messages.length === 0) return 'New Chat';
        
        const firstMessage = this.messages.find(m => m.role === 'user');
        if (!firstMessage) return 'New Chat';
        
        return firstMessage.content.substring(0, 50) + (firstMessage.content.length > 50 ? '...' : '');
    }

    // Chat actions
    togglePinChat() {
        if (!this.currentChatId) return;
        
        const chat = this.chatHistory.find(c => c.id === this.currentChatId);
        if (chat) {
            chat.pinned = !chat.pinned;
            localStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));
            this.renderChatHistory();
            this.updateChatActions();
        }
    }

    toggleBookmark() {
        if (!this.currentChatId) return;
        
        const chat = this.chatHistory.find(c => c.id === this.currentChatId);
        if (chat) {
            chat.bookmarked = !chat.bookmarked;
            localStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));
            this.renderChatHistory();
            this.updateChatActions();
        }
    }

    toggleFavorite() {
        if (!this.currentChatId) return;
        
        const chat = this.chatHistory.find(c => c.id === this.currentChatId);
        if (chat) {
            chat.favorite = !chat.favorite;
            localStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));
            this.renderChatHistory();
            this.updateChatActions();
        }
    }

    updateChatActions() {
        if (!this.currentChatId) return;
        
        const chat = this.chatHistory.find(c => c.id === this.currentChatId);
        if (!chat) return;
        
        // Update button states
        this.elements.pinChatBtn.innerHTML = chat.pinned ? 
            '<i class="fas fa-thumbtack text-blue-400"></i>' : 
            '<i class="fas fa-thumbtack"></i>';
            
        this.elements.bookmarkBtn.innerHTML = chat.bookmarked ? 
            '<i class="fas fa-bookmark text-yellow-400"></i>' : 
            '<i class="fas fa-bookmark"></i>';
            
        this.elements.favoriteBtn.innerHTML = chat.favorite ? 
            '<i class="fas fa-heart text-red-400"></i>' : 
            '<i class="fas fa-heart"></i>';
    }

    // Export functionality
    showExportModal() {
        this.elements.exportModal.classList.remove('hidden');
        this.elements.exportModal.classList.add('flex');
    }

    hideExportModal() {
        this.elements.exportModal.classList.add('hidden');
        this.elements.exportModal.classList.remove('flex');
    }

    exportChat(format) {
        if (this.messages.length === 0) {
            alert('No messages to export');
            return;
        }

        const chat = this.chatHistory.find(c => c.id === this.currentChatId);
        const title = chat ? chat.title : 'Chat Export';
        
        switch (format) {
            case 'pdf':
                this.exportToPDF(title);
                break;
            case 'docx':
                this.exportToDOCX(title);
                break;
            case 'txt':
                this.exportToTXT(title);
                break;
        }
        
        this.hideExportModal();
    }

    exportToPDF(title) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.setFontSize(16);
        doc.text(title, 20, 20);
        doc.setFontSize(12);
        
        let yPosition = 40;
        this.messages.forEach((message, index) => {
            const role = message.role === 'user' ? 'User' : 'AI';
            const text = `${role}: ${message.content}`;
            
            const lines = doc.splitTextToSize(text, 170);
            doc.text(lines, 20, yPosition);
            yPosition += lines.length * 7 + 10;
            
            if (yPosition > 280) {
                doc.addPage();
                yPosition = 20;
            }
        });
        
        doc.save(`${title}.pdf`);
    }

    exportToDOCX(title) {
        // For simplicity, create a text file with proper formatting
        let content = `${title}\n${'='.repeat(title.length)}\n\n`;
        
        this.messages.forEach(message => {
            const role = message.role === 'user' ? 'User' : 'AI';
            content += `${role}: ${message.content}\n\n`;
        });
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }

    exportToTXT(title) {
        let content = `# ${title}\n\n`;
        
        this.messages.forEach(message => {
            const role = message.role === 'user' ? '**User**' : '**AI**';
            content += `${role}: ${message.content}\n\n`;
        });
        
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title}.md`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Theme management
    setTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    applyTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        this.elements.themeSelect.value = savedTheme;
        this.setTheme(savedTheme);
    }

    // Modal management
    showCreditsModal() {
        this.elements.creditsModal.classList.remove('hidden');
        this.elements.creditsModal.classList.add('flex');
    }

    hideCreditsModal() {
        this.elements.creditsModal.classList.add('hidden');
        this.elements.creditsModal.classList.remove('flex');
    }

    openSupportChat() {
        // For now, open a new tab with support information
        // In future, this could open a dedicated support chat interface
        window.open('https://github.com/mohdumarbutt/umarock-ai/issues', '_blank');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.umarockAI = new UmaRockAI();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (window.umarockAI && !document.hidden) {
        // Refresh authentication state when user returns to page
        window.umarockAI.checkAuthState();
    }
});