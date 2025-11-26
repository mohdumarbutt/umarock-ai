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

        // Handle Environment variables safely (fallback to localhost or production URL)
        // Note: import.meta.env only works in Vite/Module environments.
        try {
            this.backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://umarock-ai.onrender.com';
        } catch (e) {
            this.backendUrl = 'https://umarock-ai.onrender.com';
        }

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
        // Get DOM elements with safety checks
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
        // We use ?. (optional chaining) so if an element is missing in HTML, JS doesn't crash.

        // Theme switching
        this.elements.themeSelect?.addEventListener('change', (e) => {
            this.setTheme(e.target.value);
        });

        // Authentication
        this.elements.authBtn?.addEventListener('click', () => {
            if (this.isAuthenticated) {
                this.signOut();
            } else {
                // Check if auth.html exists, otherwise alert
                window.location.href = 'auth.html';
            }
        });

        // New chat
        this.elements.newChatBtn?.addEventListener('click', () => {
            this.createNewChat();
        });

        // Model selection
        this.elements.modelSelect?.addEventListener('change', (e) => {
            this.currentModel = e.target.value;
        });

        // Message sending
        this.elements.sendBtn?.addEventListener('click', () => {
            this.sendMessage();
        });

        this.elements.messageInput?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Regenerate response
        this.elements.regenerateBtn?.addEventListener('click', () => {
            this.regenerateLastResponse();
        });

        // Export functionality
        this.elements.exportChatBtn?.addEventListener('click', () => {
            this.showExportModal();
        });

        // Support and about
        this.elements.supportBtn?.addEventListener('click', () => {
            this.openSupportChat();
        });

        this.elements.aboutBtn?.addEventListener('click', () => {
            this.showCreditsModal();
        });

        // Chat actions
        this.elements.pinChatBtn?.addEventListener('click', () => {
            this.togglePinChat();
        });
        this.elements.bookmarkBtn?.addEventListener('click', () => {
            this.toggleBookmark();
        });
        this.elements.favoriteBtn?.addEventListener('click', () => {
            this.toggleFavorite();
        });

        // Modal controls
        this.elements.closeCredits?.addEventListener('click', () => {
            this.hideCreditsModal();
        });
        this.elements.closeExport?.addEventListener('click', () => {
            this.hideExportModal();
        });

        // Export Actions
        this.elements.exportPDF?.addEventListener('click', () => {
            this.exportChat('pdf');
        });
        this.elements.exportDOCX?.addEventListener('click', () => {
            this.exportChat('docx');
        });
        this.elements.exportTXT?.addEventListener('click', () => {
            this.exportChat('txt');
        });

        // Auto-resize textarea
        this.elements.messageInput?.addEventListener('input', () => {
            this.autoResizeTextarea();
        });
    }

    async loadModels() {
        if (!this.elements.modelSelect) return;

        try {
            const response = await fetch(`${this.backendUrl}/api/models`);
            if (!response.ok) throw new Error('Network response was not ok');
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
            console.warn('Backend unreachable, loading fallback models:', error);
            // Fallback models
            const fallbackModels = [{
                    id: 'deepseek-r1-free',
                    name: 'DeepSeek R1 Free'
                },
                {
                    id: 'deepseek-r1-0528',
                    name: 'DeepSeek R1 0528'
                }
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
        // Mock authentication state
        const token = localStorage.getItem('authToken');
        if (token) {
            this.isAuthenticated = true;
            try {
                this.user = JSON.parse(localStorage.getItem('user') || '{}');
            } catch (e) {
                this.user = {};
            }
            if (this.elements.authText) this.elements.authText.textContent = 'Sign Out';
        } else {
            this.isAuthenticated = false;
            if (this.elements.authText) this.elements.authText.textContent = 'Sign In';
        }
    }

    async signOut() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        this.isAuthenticated = false;
        this.user = null;
        if (this.elements.authText) this.elements.authText.textContent = 'Sign In';
        window.location.reload();
    }

    createNewChat() {
        this.currentChatId = this.generateChatId();
        this.messages = [];
        if (this.elements.messagesContainer) {
            this.elements.messagesContainer.innerHTML = `
                <div class="text-center text-gray-400 py-8">
                    <i class="fas fa-robot text-4xl mb-4"></i>
                    <h2 class="text-xl font-semibold mb-2">New Chat</h2>
                    <p class="text-sm">Start a conversation with our advanced AI models</p>
                </div>
            `;
        }
        // Don't save empty chat to history yet, wait for first message
        this.updateChatActions();
    }

    async sendMessage() {
        if (!this.elements.messageInput) return;
        
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
            this.addMessage('Sorry, I encountered an error connecting to the server. Please try again.', 'assistant');
        }

        this.isLoading = false;
    }

    async handleStreamingResponse(response) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let aiMessage = '';
        let messageElement = null;

        this.hideLoadingMessage();

        try {
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
                            // Skip invalid JSON or partial chunks
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Stream error", error);
        }

        if (aiMessage) {
            // Update the internal messages array with the full response
            const lastMsg = this.messages[this.messages.length - 1];
            if (lastMsg && lastMsg.role === 'assistant') {
                lastMsg.content = aiMessage;
            } else {
                this.messages.push({ role: 'assistant', content: aiMessage, timestamp: Date.now() });
            }
            this.saveCurrentChat();
        }
    }

    addMessage(content, role) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role} fade-in p-4 rounded-lg max-w-4xl mx-auto`;

        const avatar = document.createElement('div');
        avatar.className = 'inline-block mr-3';
        avatar.innerHTML = role === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'inline-block align-top message-content'; // Added class for easier selection
        contentDiv.innerHTML = this.formatMessage(content);

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(contentDiv);

        if (this.elements.messagesContainer) {
            this.elements.messagesContainer.appendChild(messageDiv);
            this.scrollToBottom();
        }

        // Only push to array if it's a user message (assistant messages pushed after stream completes)
        if (role === 'user') {
            this.messages.push({
                role,
                content,
                timestamp: Date.now()
            });
        }

        return messageDiv;
    }

    updateMessageContent(messageElement, content) {
        const contentDiv = messageElement.querySelector('.message-content');
        if (contentDiv) {
            contentDiv.innerHTML = this.formatMessage(content);
            this.scrollToBottom();
        }
    }

    formatMessage(content) {
        if (!content) return '';

        // Escape HTML first to prevent XSS (basic)
        // Note: For production, use a library like DOMPurify
        // We do basic replacing here to allow our markdown processing to work

        // 1. Format Code Blocks
        content = content.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            const escapedCode = code.replace(/"/g, '&quot;').replace(/'/g, "\\'");
            return `<div class="code-block bg-gray-900 rounded p-3 my-2 relative">
                        <div class="flex justify-between text-xs text-gray-400 mb-2">
                            <span>${lang || 'code'}</span>
                            <button class="copy-btn hover:text-white" onclick="navigator.clipboard.writeText(\`${escapedCode}\`)">
                                <i class="fas fa-copy"></i> Copy
                            </button>
                        </div>
                        <pre><code class="language-${lang || 'text'}">${this.escapeHtml(code)}</code></pre>
                    </div>`;
        });

        // 2. Format Inline Code
        content = content.replace(/`([^`]+)`/g, '<code class="bg-gray-700 px-1 py-0.5 rounded text-sm font-mono text-pink-400">$1</code>');

        // 3. Format Bold and Italic
        content = content.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        content = content.replace(/\*([^*]+)\*/g, '<em>$1</em>');

        // 4. Convert newlines to <br> (but not inside code blocks ideally, simple regex approach)
        // We use a negative lookahead to try avoiding breaking code blocks, but simple regex is limited.
        content = content.replace(/\n/g, '<br>');

        return content;
    }

    escapeHtml(text) {
        if (!text) return '';
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    showLoadingMessage() {
        if (!this.elements.messagesContainer) return;
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loadingMessage';
        loadingDiv.className = 'message assistant fade-in p-4 rounded-lg max-w-4xl mx-auto';
        loadingDiv.innerHTML = `
            <div class="inline-block mr-3">
                <i class="fas fa-robot animate-pulse"></i>
            </div>
            <div class="inline-block align-top">
                <span class="loading-dots">Thinking...</span>
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

        // Remove last assistant message and user message from View
        // Note: Logic implies we want to retry the last user prompt
        
        // Find the last user message
        const lastUserIndex = this.messages.findLastIndex(m => m.role === 'user');
        if(lastUserIndex === -1) return;

        // Reset history to that point
        this.messages = this.messages.slice(0, lastUserIndex + 1);
        
        // Re-render view
        this.renderMessages();

        // Resend
        // We temporarily trick sendMessage by putting value back in input, or refactor sendMessage.
        // Easier approach: call API directly or set isLoading false and call logic.
        
        // Let's mimic a send:
        this.isLoading = true;
        this.showLoadingMessage();
        
        // Call API
        this.fetchChatResponse(); // Extracted logic below
    }

    async fetchChatResponse() {
        // Helper to avoid duplicate code in sendMessage and regenerate
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

            if (!response.ok) throw new Error('Failed to get response');
            await this.handleStreamingResponse(response);
        } catch (error) {
            console.error('Error:', error);
            this.hideLoadingMessage();
            this.addMessage('Error regenerating response.', 'assistant');
        }
        this.isLoading = false;
    }

    renderMessages() {
        if (!this.elements.messagesContainer) return;
        this.elements.messagesContainer.innerHTML = '';
        this.messages.forEach(message => {
            // We manually append instead of calling addMessage to avoid double pushing to array
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${message.role} fade-in p-4 rounded-lg max-w-4xl mx-auto`;
            
            const avatar = document.createElement('div');
            avatar.className = 'inline-block mr-3';
            avatar.innerHTML = message.role === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'inline-block align-top message-content';
            contentDiv.innerHTML = this.formatMessage(message.content);
            
            messageDiv.appendChild(avatar);
            messageDiv.appendChild(contentDiv);
            this.elements.messagesContainer.appendChild(messageDiv);
        });
        this.scrollToBottom();
    }

    getMessagesForAPI() {
        return this.messages.map(msg => ({
            role: msg.role,
            content: msg.content
        }));
    }

    scrollToBottom() {
        if (this.elements.messagesContainer) {
            this.elements.messagesContainer.scrollTop = this.elements.messagesContainer.scrollHeight;
        }
    }

    autoResizeTextarea() {
        const textarea = this.elements.messageInput;
        if (!textarea) return;
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }

    // Chat history management
    loadChatHistory() {
        try {
            const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
            this.chatHistory = Array.isArray(history) ? history : [];
            this.renderChatHistory();
        } catch (e) {
            console.error("Failed to load history", e);
            this.chatHistory = [];
        }
    }

    saveChatToHistory() {
        if (!this.currentChatId || this.messages.length === 0) return;

        const chat = {
            id: this.currentChatId,
            title: this.generateChatTitle(),
            messages: [...this.messages],
            model: this.currentModel,
            timestamp: Date.now(),
            pinned: this.isCurrentChatPinned(),
            bookmarked: this.isCurrentChatBookmarked(),
            favorite: this.isCurrentChatFavorite()
        };

        const existingIndex = this.chatHistory.findIndex(c => c.id === this.currentChatId);
        if (existingIndex >= 0) {
            // Keep existing flags if not explicitly changed
            chat.pinned = this.chatHistory[existingIndex].pinned;
            chat.bookmarked = this.chatHistory[existingIndex].bookmarked;
            chat.favorite = this.chatHistory[existingIndex].favorite;
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
        if (!this.elements.chatHistory) return;
        this.elements.chatHistory.innerHTML = '';
        
        // Sort: Pinned first, then by date
        const sortedHistory = [...this.chatHistory].sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            return b.timestamp - a.timestamp;
        });

        sortedHistory.slice(0, 20).forEach(chat => { // Limit to 20 for performance
            const chatItem = document.createElement('div');
            chatItem.className = 'p-3 rounded-lg hover:bg-gray-700 cursor-pointer text-sm mb-1 transition-colors';
            if(chat.id === this.currentChatId) chatItem.classList.add('bg-gray-700');
            
            chatItem.innerHTML = `
                <div class="flex items-center justify-between">
                    <div class="flex-1 truncate pr-2">
                        <div class="font-medium truncate">${chat.title}</div>
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
        
        if (this.elements.modelSelect) {
            this.elements.modelSelect.value = this.currentModel;
        }
        
        this.renderMessages();
        this.updateChatActions();
        
        // Update styling of history list
        this.renderChatHistory();
        
        // Mobile sidebar close could go here
    }

    generateChatId() {
        return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateChatTitle() {
        if (this.messages.length === 0) return 'New Chat';
        const firstMessage = this.messages.find(m => m.role === 'user');
        if (!firstMessage) return 'New Chat';
        return firstMessage.content.substring(0, 30) + (firstMessage.content.length > 30 ? '...' : '');
    }

    // Chat actions
    isCurrentChatPinned() {
        const chat = this.chatHistory.find(c => c.id === this.currentChatId);
        return chat ? chat.pinned : false;
    }
    isCurrentChatBookmarked() {
        const chat = this.chatHistory.find(c => c.id === this.currentChatId);
        return chat ? chat.bookmarked : false;
    }
    isCurrentChatFavorite() {
        const chat = this.chatHistory.find(c => c.id === this.currentChatId);
        return chat ? chat.favorite : false;
    }

    togglePinChat() {
        if (!this.currentChatId) return;
        const chat = this.chatHistory.find(c => c.id === this.currentChatId);
        if (chat) {
            chat.pinned = !chat.pinned;
            this.saveChatToHistory(); // This saves and re-renders
            this.updateChatActions();
        }
    }

    toggleBookmark() {
        if (!this.currentChatId) return;
        const chat = this.chatHistory.find(c => c.id === this.currentChatId);
        if (chat) {
            chat.bookmarked = !chat.bookmarked;
            this.saveChatToHistory();
            this.updateChatActions();
        }
    }

    toggleFavorite() {
        if (!this.currentChatId) return;
        const chat = this.chatHistory.find(c => c.id === this.currentChatId);
        if (chat) {
            chat.favorite = !chat.favorite;
            this.saveChatToHistory();
            this.updateChatActions();
        }
    }

    updateChatActions() {
        if (!this.currentChatId) return;
        const chat = this.chatHistory.find(c => c.id === this.currentChatId);
        
        if (this.elements.pinChatBtn) 
            this.elements.pinChatBtn.innerHTML = (chat && chat.pinned) ? '<i class="fas fa-thumbtack text-blue-400"></i>' : '<i class="fas fa-thumbtack"></i>';
        
        if (this.elements.bookmarkBtn) 
            this.elements.bookmarkBtn.innerHTML = (chat && chat.bookmarked) ? '<i class="fas fa-bookmark text-yellow-400"></i>' : '<i class="fas fa-bookmark"></i>';
        
        if (this.elements.favoriteBtn) 
            this.elements.favoriteBtn.innerHTML = (chat && chat.favorite) ? '<i class="fas fa-heart text-red-400"></i>' : '<i class="fas fa-heart"></i>';
    }

    // Export functionality
    showExportModal() {
        this.elements.exportModal?.classList.remove('hidden');
        this.elements.exportModal?.classList.add('flex');
    }

    hideExportModal() {
        this.elements.exportModal?.classList.add('hidden');
        this.elements.exportModal?.classList.remove('flex');
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
        if (!window.jspdf) {
            alert('PDF library not loaded. Please include jspdf in your HTML.');
            return;
        }
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.setFontSize(16);
        doc.text(title, 20, 20);
        doc.setFontSize(10);
        
        let yPosition = 40;
        const pageHeight = doc.internal.pageSize.height;

        this.messages.forEach((message) => {
            const role = message.role === 'user' ? 'User' : 'AI';
            const text = `${role}:\n${message.content}\n\n`;
            
            // Split text to fit width
            const lines = doc.splitTextToSize(text, 170);
            
            // Check if we need a new page
            if (yPosition + (lines.length * 5) > pageHeight - 20) {
                doc.addPage();
                yPosition = 20;
            }
            
            doc.text(lines, 20, yPosition);
            yPosition += lines.length * 5;
        });

        doc.save(`${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
    }

    exportToDOCX(title) {
        // Without a library like 'docx', we can't create a real DOCX.
        // We will create a rich text compatible doc or just text marked as doc.
        let content = `${title}\n${'='.repeat(title.length)}\n\n`;
        this.messages.forEach(message => {
            const role = message.role === 'user' ? 'USER' : 'AI';
            content += `[${role}]\n${message.content}\n\n-------------------\n\n`;
        });

        const blob = new Blob([content], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.doc`; // .doc is often safer for plain text masquerading
        a.click();
        URL.revokeObjectURL(url);
    }

    exportToTXT(title) {
        let content = `${title}\n\n`;
        this.messages.forEach(message => {
            const role = message.role === 'user' ? 'User' : 'AI';
            content += `${role}: ${message.content}\n\n`;
        });

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
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
        if (this.elements.themeSelect) {
            this.elements.themeSelect.value = savedTheme;
        }
        this.setTheme(savedTheme);
    }

    // Modal management
    showCreditsModal() {
        this.elements.creditsModal?.classList.remove('hidden');
        this.elements.creditsModal?.classList.add('flex');
    }

    hideCreditsModal() {
        this.elements.creditsModal?.classList.add('hidden');
        this.elements.creditsModal?.classList.remove('flex');
    }

    openSupportChat() {
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
        window.umarockAI.checkAuthState();
    }
});
