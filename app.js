import { io } from 'socket.io-client';

class RemoteControlSystem {
    constructor() {
        this.socket = null;
        this.deviceType = null;
        this.isScreenSharing = false;
        this.mediaStream = null;
        this.recognition = null;
        this.isListening = false;
        
        this.init();
    }
    
    init() {
        this.setupDeviceSelection();
        this.setupSocketConnection();
        this.setupVoiceRecognition();
    }
    
    setupDeviceSelection() {
        const deviceCards = document.querySelectorAll('.device-card');
        
        deviceCards.forEach(card => {
            card.addEventListener('click', () => {
                const deviceType = card.dataset.device;
                this.selectDevice(deviceType);
            });
        });
    }
    
    selectDevice(deviceType) {
        this.deviceType = deviceType;
        
        // Update UI
        document.querySelectorAll('.device-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-device="${deviceType}"]`).classList.add('selected');
        
        // Show appropriate app
        document.querySelectorAll('.app-container').forEach(container => {
            container.style.display = 'none';
        });
        document.getElementById(`${deviceType}-app`).style.display = 'block';
        
        // Setup device-specific functionality
        if (deviceType === 'laptop') {
            this.setupLaptopControls();
        } else if (deviceType === 'mobile') {
            this.setupMobileControls();
        }
        
        // Register device with server
        if (this.socket && this.socket.connected) {
            this.registerDevice();
        }
    }
    
    setupSocketConnection() {
        const serverURL = 'https://9bfa-211-27-4-195.ngrok-free.app';

        this.socket = io(serverURL, {
        transports: ['websocket']
        });

        this.socket.on('connect', () => {
            console.log('Connected to server');
            if (this.deviceType) {
                this.registerDevice();
            }
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from server');
            this.updateConnectionStatus(false);
        });

        this.socket.on('device-connected', (data) => {
            console.log('Device connected:', data);
            this.updateConnectedDevices(data, true);
        });

        this.socket.on('device-disconnected', (data) => {
            console.log('Device disconnected:', data);
            this.updateConnectedDevices(data, false);
        });

        this.socket.on('screen-update', (data) => {
            if (this.deviceType === 'mobile') {
                this.updateScreenViewer(data);
            }
        });

        this.socket.on('execute-command', (data) => {
            if (this.deviceType === 'laptop') {
                this.executeCommand(data);
            }
        });

        this.socket.on('execute-action', (data) => {
            if (this.deviceType === 'laptop') {
                this.executeAction(data);
            }
        });
    }
    registerDevice() {
        const deviceId = `${this.deviceType}-${Date.now()}`;
        this.socket.emit('register-device', {
            deviceType: this.deviceType,
            deviceId: deviceId
        });
        this.updateConnectionStatus(true);
    }
    
    updateConnectionStatus(connected) {
        const statusElement = document.getElementById(`${this.deviceType}-status`);
        if (statusElement) {
            statusElement.className = `status ${connected ? 'connected' : 'disconnected'}`;
            statusElement.textContent = connected ? 
                `Connected as ${this.deviceType}` : 
                `Disconnected - ${this.deviceType === 'laptop' ? 'Waiting for connection' : 'Connecting to laptop'}...`;
        }
    }
    
    setupLaptopControls() {
        const startBtn = document.getElementById('start-screen-share');
        const stopBtn = document.getElementById('stop-screen-share');
        
        startBtn.addEventListener('click', () => this.startScreenShare());
        stopBtn.addEventListener('click', () => this.stopScreenShare());
    }
    
    async startScreenShare() {
        try {
            this.mediaStream = await navigator.mediaDevices.getDisplayMedia({
                video: { mediaSource: 'screen' },
                audio: true
            });
            
            const video = document.createElement('video');
            video.srcObject = this.mediaStream;
            video.play();
            
            // Simulate screen sharing by sending periodic updates
            this.isScreenSharing = true;
            this.screenShareInterval = setInterval(() => {
                if (this.isScreenSharing) {
                    this.captureAndSendScreen();
                }
            }, 1000); // Send screen update every second
            
            document.getElementById('start-screen-share').disabled = true;
            document.getElementById('stop-screen-share').disabled = false;
            
            this.addToCommandLog('Screen sharing started');
            
        } catch (error) {
            console.error('Error starting screen share:', error);
            this.addToCommandLog('Error: Could not start screen sharing');
        }
    }
    
    stopScreenShare() {
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(track => track.stop());
            this.mediaStream = null;
        }
        
        this.isScreenSharing = false;
        if (this.screenShareInterval) {
            clearInterval(this.screenShareInterval);
        }
        
        document.getElementById('start-screen-share').disabled = false;
        document.getElementById('stop-screen-share').disabled = true;
        
        this.addToCommandLog('Screen sharing stopped');
    }
    
    async captureAndSendScreen() {
        if (!this.mediaStream) return;

        try {
            const videoTrack = this.mediaStream.getVideoTracks()[0];
            const imageCapture = new ImageCapture(videoTrack);

            const bitmap = await imageCapture.grabFrame();

            const canvas = document.createElement('canvas');
            canvas.width = bitmap.width;
            canvas.height = bitmap.height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(bitmap, 0, 0);

            const base64Image = canvas.toDataURL('image/jpeg', 0.5); // compressed image

            this.socket.emit('screen-share', {
                timestamp: Date.now(),
                width: bitmap.width,
                height: bitmap.height,
                data: base64Image
            });
        } catch (err) {
            console.error('Error capturing and sending screen:', err);
        }
    }
    
    executeCommand(data) {
        const { command, timestamp } = data;
        this.addToCommandLog(`Voice Command: "${command}"`);
        
        // Simulate command execution
        setTimeout(() => {
            this.addToCommandLog(`Executed: ${command}`);
        }, 500);
    }
    
    executeAction(data) {
        const { action, value } = data;
        this.addToCommandLog(`Action: ${action}${value ? ` - ${value}` : ''}`);
    }
    
    addToCommandLog(message) {
        const log = document.getElementById('command-log');
        const timestamp = new Date().toLocaleTimeString();
        log.innerHTML += `<div>[${timestamp}] ${message}</div>`;
        log.scrollTop = log.scrollHeight;
    }
    
    updateConnectedDevices(data, connected) {
        const devicesElement = document.getElementById('connected-devices');
        if (connected) {
            devicesElement.innerHTML = `<div>📱 ${data.deviceType} connected (${data.deviceId})</div>`;
        } else {
            devicesElement.innerHTML = 'No devices connected';
        }
    }
    
    setupMobileControls() {
        const voiceBtn = document.getElementById('voice-command-btn');
        const keyboardToggle = document.getElementById('keyboard-toggle');
        const virtualKeyboard = document.getElementById('virtual-keyboard');
        const sendTextBtn = document.getElementById('send-text');
        const textInput = document.getElementById('text-input');
        
        voiceBtn.addEventListener('click', () => this.toggleVoiceRecognition());
        keyboardToggle.addEventListener('click', () => {
            virtualKeyboard.style.display = virtualKeyboard.style.display === 'none' ? 'block' : 'none';
        });
        
        sendTextBtn.addEventListener('click', () => {
            const text = textInput.value.trim();
            if (text) {
                this.sendRemoteAction('type-text', text);
                textInput.value = '';
            }
        });
        
        // Virtual keyboard keys
        document.querySelectorAll('.key-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const key = btn.dataset.key;
                this.sendRemoteAction('key-press', key);
            });
        });
        
        // Style virtual keyboard buttons
        const style = document.createElement('style');
        style.textContent = `
            .key-btn {
                padding: 10px;
                border: none;
                border-radius: 5px;
                background: rgba(255,255,255,0.2);
                color: white;
                cursor: pointer;
                transition: background 0.2s;
            }
            .key-btn:hover {
                background: rgba(255,255,255,0.3);
            }
        `;
        document.head.appendChild(style);
    }
    
    setupVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
            
            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateVoiceStatus('Listening...');
                document.getElementById('voice-command-btn').style.background = '#ef4444';
                document.getElementById('voice-command-btn').textContent = '🔴 Listening...';
            };
            
            this.recognition.onresult = (event) => {
                const command = event.results[0][0].transcript;
                this.updateVoiceStatus(`Recognized: "${command}"`);
                this.sendVoiceCommand(command);
            };
            
            this.recognition.onerror = (event) => {
                this.updateVoiceStatus(`Error: ${event.error}`);
                this.resetVoiceButton();
            };
            
            this.recognition.onend = () => {
                this.isListening = false;
                this.resetVoiceButton();
            };
        } else {
            console.warn('Speech recognition not supported');
        }
    }
    
    toggleVoiceRecognition() {
        if (!this.recognition) {
            this.updateVoiceStatus('Speech recognition not supported');
            return;
        }
        
        if (this.isListening) {
            this.recognition.stop();
        } else {
            this.recognition.start();
        }
    }
    
    resetVoiceButton() {
        document.getElementById('voice-command-btn').style.background = '#3b82f6';
        document.getElementById('voice-command-btn').textContent = '🎤 Voice Command';
    }
    
    updateVoiceStatus(message) {
        const statusElement = document.getElementById('voice-status');
        if (statusElement) {
            statusElement.textContent = message;
        }
    }
    
    sendVoiceCommand(command) {
        if (this.socket && this.socket.connected) {
            this.socket.emit('voice-command', {
                command: command,
                timestamp: Date.now()
            });
            this.updateVoiceStatus(`Sent: "${command}"`);
        }
    }
    
    sendRemoteAction(action, value = null) {
        if (this.socket && this.socket.connected) {
            this.socket.emit('remote-action', {
                action: action,
                value: value,
                timestamp: Date.now()
            });
        }
    }
    
    
    updateScreenViewer(data) {
        console.log('Received screen data:', data);

        const viewer = document.getElementById('screen-viewer');
        viewer.innerHTML = `
            <img src="${data.data}" alt="Shared Screen" style="max-width: 100%; border-radius: 10px;" />
            <div style="text-align: center; font-size: 0.8rem; opacity: 0.7;">
                ${data.width}x${data.height} - ${new Date(data.timestamp).toLocaleTimeString()}
            </div>
        `;
    }
}

// Initialize the system when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new RemoteControlSystem();
});

// Service Worker registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}