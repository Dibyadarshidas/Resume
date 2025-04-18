// Diby Chatbot - AI Assistant
class DibyChatbot {
    constructor(options = {}) {
        // Try to load configuration from external file
        let configOptions = {};
        try {
            // Check if CONFIG is defined (from config.js)
            if (typeof CONFIG !== 'undefined') {
                if (CONFIG.openai) {
                    configOptions = {
                        apiEndpoint: 'https://api.openai.com/v1/chat/completions',
                        apiKey: CONFIG.openai.apiKey,
                        modelName: CONFIG.openai.model,
                        maxTokens: CONFIG.openai.maxTokens,
                        temperature: CONFIG.openai.temperature,
                        provider: 'openai'
                    };
                } else if (CONFIG.huggingface) {
                    configOptions = {
                        apiEndpoint: 'https://api-inference.huggingface.co/models/' + (CONFIG.huggingface.model || 'google/flan-t5-small'),
                        apiKey: CONFIG.huggingface.apiKey,
                        modelName: CONFIG.huggingface.model || 'google/flan-t5-small',
                        provider: 'huggingface'
                    };
                } else if (CONFIG.provider === 'freeapi') {
                    configOptions = {
                        provider: 'mock',
                    };
                } else if (CONFIG.provider === 'openai-client') {
                    configOptions = {
                        apiKey: CONFIG.openaiClient.apiKey,
                        modelName: CONFIG.openaiClient.model,
                        maxTokens: CONFIG.openaiClient.maxTokens,
                        temperature: CONFIG.openaiClient.temperature,
                        provider: 'openai-client'
                    };
                }
                console.log("Config loaded successfully");
            }
        } catch (e) {
            console.warn("External config not found, using default or provided options");
        }

        // Force mock provider regardless of config or options
        configOptions.provider = 'mock';
        
        // Merge external config with provided options
        const mergedOptions = { ...configOptions, ...options, provider: 'mock' };
        
        // Configuration
        this.provider = 'mock'; // Always use the built-in system
        this.apiEndpoint = mergedOptions.apiEndpoint || null;
        this.apiKey = mergedOptions.apiKey || null;
        this.modelName = mergedOptions.modelName || null;
        this.maxTokens = mergedOptions.maxTokens || 150;
        this.temperature = mergedOptions.temperature || 0.7;
        
        // DOM Elements
        this.container = document.querySelector('.chatbot-container');
        this.messagesContainer = document.querySelector('.chatbot-messages');
        this.form = document.getElementById('chatbot-form');
        this.input = document.getElementById('user-message');
        this.closeBtn = document.querySelector('.chatbot-close');
        this.openBtn = document.querySelector('.floating-cta-btn');
        
        // Conversation history
        this.conversationHistory = [{
            role: "system",
            content: `You are Diby, an AI assistant for Dibyadarshi Das's portfolio website. 
            
            About Dibyadarshi Das:
            - He is a skilled software engineer specializing in full-stack development, AI integration, and responsive web design
            - His technical skills include JavaScript, React, Node.js, Python, Machine Learning, and more
            - He has worked on various projects including e-commerce platforms, dashboards, mobile apps, and AI solutions
            - He is passionate about clean code, innovative solutions, and excellent user experiences
            - He offers mentorship, custom development services, and consulting
            
            Guidelines:
            - Keep responses concise, friendly, and professional (1-3 sentences when possible)
            - If asked about contact information, direct users to the contact form on the website
            - For technical questions, you can provide brief explanations based on your knowledge about Dibyadarshi
            - If you don't know specific details about projects, suggest they explore the portfolio section
            - Avoid making up specific experiences or client names that aren't mentioned in this context
            
            Your role is to be helpful, informative, and direct users to relevant sections of the portfolio when appropriate.`
        }];
        
        // Initialize chatbot
        this.init();
    }
    
    // Initialize chatbot
    init() {
        // Check if the elements exist before initializing
        if (!this.container || !this.messagesContainer || !this.form || !this.input || !this.closeBtn || !this.openBtn) {
            console.error("Chatbot: Required DOM elements not found");
            return;
        }

        // Add event listeners
        this.addEventListeners();
        
        // Don't add the initial message here - it's already in the HTML
        // The welcome message is already in the HTML as part of the chatbot-messages div
        
        // Log the provider being used
        console.log("Chatbot initialized with provider:", this.provider);
    }
    
    // Add event listeners
    addEventListeners() {
        // Open chatbot
        this.openBtn.addEventListener('click', () => {
            this.container.classList.add('active');
            setTimeout(() => {
                this.input.focus();
            }, 300);
        });
        
        // Close chatbot
        this.closeBtn.addEventListener('click', () => {
            this.container.classList.remove('active');
        });
        
        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleUserMessage();
        });

        // Handle input with Enter key
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.form.dispatchEvent(new Event('submit'));
            }
        });
    }
    
    // Handle user message submission
    handleUserMessage() {
        const message = this.input.value.trim();
        if (!message) return;
        
        // Add user message to chat
        this.addMessage('user', message);
        
        // Store in conversation history
        this.conversationHistory.push({
            role: "user",
            content: message
        });
        
        // Clear input
        this.input.value = '';
        
        // Show typing indicator
        const typingIndicator = this.showTypingIndicator();
        
        // Get response from AI or mock system
        this.getAIResponse(message)
            .then(response => {
                // Remove typing indicator
                if (typingIndicator) typingIndicator.remove();
                
                // Add AI response to chat
                this.addMessage('bot', response);
                
                // Store in conversation history
                this.conversationHistory.push({
                    role: "assistant",
                    content: response
                });
                
                // Maintain history length (prevent too long context)
                if (this.conversationHistory.length > 10) {
                    // Keep system message and last 8 exchanges
                    const systemMessage = this.conversationHistory[0];
                    this.conversationHistory = [
                        systemMessage,
                        ...this.conversationHistory.slice(-8)
                    ];
                }
            })
            .catch(error => {
                // Remove typing indicator
                if (typingIndicator) typingIndicator.remove();
                
                // Show error message
                this.addMessage('bot', "I'm sorry, I encountered an error. Please try again later.");
                console.error("Chatbot error:", error);
            });
    }
    
    // Get response from AI model or mock system
    async getAIResponse(message) {
        try {
            if (this.provider === 'openai-client') {
                return await this.getOpenAIClientResponse(message);
            } else {
                // Always use the local mock system as fallback
                // This is the most reliable option and won't have API failures
                return await this.getMockResponse(message);
            }
        } catch (error) {
            console.error("Response error:", error);
            return "I'm sorry, I'm having trouble processing your request. Please try again later.";
        }
    }

    // Get response using the OpenAI client library (latest API version)
    async getOpenAIClientResponse(message) {
        try {
            // Check if the OpenAI client is available
            if (typeof OpenAI === 'undefined') {
                console.error("OpenAI client library not found");
                throw new Error("OpenAI client library not available");
            }
            
            console.log("Creating OpenAI client with API key:", this.apiKey.substring(0, 10) + "...");
            
            // Create OpenAI client
            const client = new OpenAI({
                apiKey: this.apiKey,
                dangerouslyAllowBrowser: true // Enable usage in browser
            });
            
            // Get the last few messages to maintain context (max 5 for efficiency)
            const recentMessages = this.conversationHistory.slice(-5);

            // Format messages for the OpenAI API
            const systemMessage = this.conversationHistory[0];
            
            // Use the chat completions API - more reliable for most implementations
            try {
                console.log("Sending message to OpenAI API with model:", this.modelName);
                
                const response = await client.chat.completions.create({
                    model: this.modelName || "gpt-3.5-turbo",
                    messages: [
                        systemMessage,
                        ...recentMessages
                    ],
                    max_tokens: this.maxTokens,
                    temperature: this.temperature,
                });
                
                console.log("OpenAI response received:", response.choices[0].message.content.substring(0, 50) + "...");
                return response.choices[0].message.content;
            } catch (e) {
                console.error("OpenAI chat completions error:", e);
                throw e;
            }
        } catch (error) {
            console.error("OpenAI client error:", error);
            throw error;
        }
    }

    // Smart keyword-based response system with intelligence
    getMockResponse(message) {
        return new Promise(resolve => {
            // Simple keyword-based fallback system
            const lowercaseMsg = message.toLowerCase();
            
            // Define simple keyword-based responses
            const mockResponses = {
                greeting: {
                    keywords: ["hello", "hi", "hey", "greetings"],
                    responses: [
                        "Hello! I'm Diby, Dibyadarshi's AI assistant. How can I help you today?",
                        "Hi there! How can I assist you with information about Dibyadarshi's services or portfolio?"
                    ]
                },
                services: {
                    keywords: ["services", "offer", "provide", "help with"],
                    responses: [
                        "Dibyadarshi offers full-stack development, AI integration, responsive web design, and performance optimization. Want to know more about a specific service?",
                        "His services include web development, AI integration, data analysis, and UI/UX design. Is there a particular area you're interested in?"
                    ]
                },
                experience: {
                    keywords: ["experience", "background", "worked", "projects", "portfolio"],
                    responses: [
                        "Dibyadarshi has extensive experience in creating web applications and AI solutions. Check out the portfolio section for specific examples of Picky, Keeper, and Noraa projects.",
                        "He has worked on various projects including e-commerce platforms, dashboards, and mobile apps. The portfolio section showcases some of his best work including Creative Mantra and Chakhhna."
                    ]
                },
                contact: {
                    keywords: ["contact", "reach", "email", "phone", "hire"],
                    responses: [
                        "You can reach Dibyadarshi through the contact form on this website or directly at ddas270@gmail.com. Would you like me to direct you there?",
                        "The best way to contact Dibyadarshi is via email at ddas270@gmail.com or phone at +91 7008347451. Would you like to discuss a potential project?"
                    ]
                },
                skills: {
                    keywords: ["skills", "technologies", "languages", "tech stack", "framework"],
                    responses: [
                        "Dibyadarshi is skilled in JavaScript, React, Node.js, Python, and various AI/ML technologies. His frontend skills are rated at 90% proficiency according to his skills chart.",
                        "His tech stack includes frontend frameworks like React (88% proficiency), backend technologies like Node.js (80%) and MongoDB (75%), and various DevOps tools including Docker and AWS."
                    ]
                },
                about: {
                    keywords: ["about", "who is", "tell me about", "dibyadarshi"],
                    responses: [
                        "Dibyadarshi Das is a software engineer specializing in full-stack development, AI integration, and responsive web design. He's based in Odisha, India and creates innovative solutions for complex problems.",
                        "Dibyadarshi is a passionate developer who combines technical expertise with creative problem-solving. He focuses on delivering high-quality, user-friendly applications and offers mentorship in frontend development."
                    ]
                },
                education: {
                    keywords: ["education", "degree", "university", "college", "study", "studied"],
                    responses: [
                        "Dibyadarshi has a strong educational background in computer science and software engineering, which serves as the foundation for his technical expertise.",
                        "His education in computer science combined with continuous learning has helped him stay at the forefront of technology trends and enhance his skills in AI-enhanced development methods."
                    ]
                },
                location: {
                    keywords: ["location", "based", "live", "country", "city", "remote"],
                    responses: [
                        "Dibyadarshi is based in Odisha, India but works remotely and collaborates with clients globally.",
                        "While Dibyadarshi is located in Odisha, India, he's always available online for project discussions and collaboration regardless of your location."
                    ]
                },
                process: {
                    keywords: ["process", "methodology", "approach", "workflow", "how do you work"],
                    responses: [
                        "Dibyadarshi follows an agile development approach, starting with thorough requirements gathering, followed by iterative development with regular client feedback.",
                        "His work process typically involves understanding client needs, creating a project roadmap, developing in sprints, and ensuring thorough testing before delivery."
                    ]
                },
                react: {
                    keywords: ["react", "frontend", "frontend framework", "javascript framework", "ui"],
                    responses: [
                        "Dibyadarshi has extensive experience with React, using it to build dynamic, responsive user interfaces with 88% proficiency according to his skills assessment.",
                        "React is one of Dibyadarshi's core skills. He uses it along with tools like Redux, hooks, and context API to create maintainable frontend applications like the Picky and Keeper projects in his portfolio."
                    ]
                },
                node: {
                    keywords: ["node", "nodejs", "backend", "server", "express"],
                    responses: [
                        "Dibyadarshi uses Node.js for building scalable backend systems and APIs with 80% proficiency. He has experience with frameworks like Express and integrates with MongoDB databases.",
                        "For backend development, Dibyadarshi leverages Node.js to create efficient server-side applications with good performance characteristics, particularly for his food delivery and note-taking applications."
                    ]
                },
                ai: {
                    keywords: ["ai", "artificial intelligence", "machine learning", "ml", "data science", "prompt"],
                    responses: [
                        "Dibyadarshi integrates AI solutions into applications and offers AI-Enhanced Development mentorship that covers prompt engineering and GitHub Copilot mastery.",
                        "In the AI space, Dibyadarshi focuses on practical applications that solve real business problems, from predictive analytics to natural language processing. His mentorship program includes effective prompt engineering techniques."
                    ]
                },
                mentorship: {
                    keywords: ["mentor", "teaching", "learn", "mentorship", "training", "coaching", "student"],
                    responses: [
                        "Dibyadarshi offers comprehensive mentorship programs in Frontend Development Mastery, AI-Enhanced Development, and Career Acceleration. His 6-step roadmap takes you from skills assessment to career launch.",
                        "His mentorship has helped students like Rohit K. transform from a marketing associate to a React developer with a 40% salary increase, and Priya M. advance from junior to senior position in just 18 months."
                    ]
                },
                pricing: {
                    keywords: ["price", "cost", "rate", "budget", "charge", "pricing", "fee", "quote", "discount"],
                    responses: [
                        "Dibyadarshi's rates depend on project requirements and scope. There's currently a limited-time offer of 25% off the first mentorship session - you can claim this through the banner at the top of the page.",
                        "Project pricing is based on complexity, timeline, and specific requirements. For mentorship, there's a special 25% discount available for first-time sessions."
                    ]
                },
                availability: {
                    keywords: ["available", "availability", "schedule", "timeline", "when", "start"],
                    responses: [
                        "Dibyadarshi is currently available for freelance work, frontend mentorship, and prompt engineering according to his profile. You can book a free 30-minute strategy session to discuss your goals.",
                        "For information about current availability and project timelines, please use the contact form or email ddas270@gmail.com to start a conversation directly."
                    ]
                },
                portfolio: {
                    keywords: ["portfolio", "showcase", "examples", "work", "case studies"],
                    responses: [
                        "Dibyadarshi's portfolio includes projects like Picky (food delivery website), Keeper (note-taking app), Creative Mantra (design agency website), Noraa (voice assistant), and Chakhhna (restaurant website).",
                        "In his portfolio, you'll find various web and app projects demonstrating his skills in React, Node.js, and responsive design. Each project showcases different aspects of his technical capabilities."
                    ]
                },
                // Specific project responses
                picky: {
                    keywords: ["picky", "food delivery", "food app", "delivery website"],
                    responses: [
                        "Picky is a food delivery website with a modern UI that Dibyadarshi built using React, Node.js, and MongoDB. It's featured in his portfolio and demonstrates his full-stack capabilities.",
                        "The Picky project showcases Dibyadarshi's ability to create engaging user interfaces for food delivery services, combining frontend and backend technologies for a complete solution."
                    ]
                },
                keeper: {
                    keywords: ["keeper", "note", "note app", "notes app", "note-taking"],
                    responses: [
                        "Keeper is a note-taking application built with React that demonstrates Dibyadarshi's frontend development skills. It features a clean, intuitive interface for managing personal notes.",
                        "The Keeper app in Dibyadarshi's portfolio showcases his React skills and ability to create practical, user-friendly applications with clean design principles."
                    ]
                },
                creativemantra: {
                    keywords: ["creative mantra", "design agency", "agency website", "creative agency"],
                    responses: [
                        "Creative Mantra is a design agency website that Dibyadarshi created using HTML, CSS, and JavaScript. It demonstrates his ability to create professional business websites with engaging visuals.",
                        "The Creative Mantra project in his portfolio shows Dibyadarshi's skills in creating polished websites for creative businesses, with attention to design details and user experience."
                    ]
                },
                noraa: {
                    keywords: ["noraa", "voice", "voice assistant", "speech", "assistant app"],
                    responses: [
                        "Noraa is a voice assistant application that Dibyadarshi built using React, Node.js, and the Speech API. It's designed to help users with daily tasks through voice commands.",
                        "The Noraa project demonstrates Dibyadarshi's ability to work with advanced technologies like speech recognition and natural language processing in a user-friendly application."
                    ]
                },
                testimonials: {
                    keywords: ["testimonial", "feedback", "review", "client", "what do people say"],
                    responses: [
                        "Clients like John Doe (CEO of Creative Mantra) praise Dibyadarshi's attention to detail, while Jane Smith from Picky Foods highlights how he increased their online visibility.",
                        "Mark Johnson, CTO of TechInnovate, has praised Dibyadarshi's expertise in web development and valuable insights for improving user experience."
                    ]
                },
                success: {
                    keywords: ["success", "results", "outcome", "achievement", "impact"],
                    responses: [
                        "Dibyadarshi's mentorship has led to impressive success stories, like Rohit who went from marketing to React development with a 40% salary increase in just 6 months.",
                        "His work has helped career changers like Amit G. transition from accounting to web development, and helped Priya M. secure a senior position just 18 months into her career."
                    ]
                },
                resume: {
                    keywords: ["resume", "cv", "curriculum", "qualifications", "work history"],
                    responses: [
                        "Dibyadarshi's resume is available for download directly from the navigation menu. It contains his complete work history, technical skills, and professional achievements.",
                        "You can access Dibyadarshi's resume by clicking the 'Resume' link in the navigation bar. It provides detailed information about his professional background and technical expertise."
                    ]
                },
                communication: {
                    keywords: ["communication", "contact preference", "updates", "progress", "meetings"],
                    responses: [
                        "Dibyadarshi maintains clear communication throughout projects with regular updates, progress reports, and availability for meetings or calls when needed.",
                        "For client projects, Dibyadarshi typically provides weekly progress updates and is available for questions via email, phone, or scheduled video calls depending on your preference."
                    ]
                },
                benefits: {
                    keywords: ["benefits", "advantage", "why choose", "what makes", "different", "unique"],
                    responses: [
                        "Working with Dibyadarshi offers several benefits: accelerated learning (3x faster rate), industry-relevant skills (92% job placement rate), AI-enhanced methods (2x productivity), and access to a community of 150+ developers.",
                        "What makes Dibyadarshi's approach unique is his combination of technical expertise with mentorship skills, helping clients and students achieve concrete results through practical, modern solutions."
                    ]
                },
                process: {
                    keywords: ["process", "methodology", "approach", "workflow", "how do you work"],
                    responses: [
                        "Dibyadarshi follows an agile development approach, starting with thorough requirements gathering, followed by iterative development with regular client feedback.",
                        "His work process typically involves understanding client needs, creating a project roadmap, developing in sprints, and ensuring thorough testing before delivery."
                    ]
                },
                collaboration: {
                    keywords: ["collaborate", "team", "working together", "partnership", "joint"],
                    responses: [
                        "Dibyadarshi collaborates effectively with teams of all sizes, adapting to your existing workflows while bringing valuable expertise to enhance project outcomes.",
                        "For collaborative projects, Dibyadarshi integrates seamlessly with your team, using tools like Git for version control and various project management platforms to ensure smooth coordination."
                    ]
                },
                technologies: {
                    keywords: ["html", "css", "sass", "javascript", "typescript", "python", "mongodb", "docker", "aws", "git"],
                    responses: [
                        "Dibyadarshi is proficient in HTML (95%), CSS (90%), JavaScript (92%), React (88%), Node.js (80%), MongoDB (75%), and various other technologies as shown in his skills section.",
                        "His technical skills span frontend (HTML, CSS, JavaScript, React), backend (Node.js, MongoDB), and DevOps tools (Docker, AWS, Git) with varying levels of expertise shown in his skills chart."
                    ]
                },
                chatbot: {
                    keywords: ["chatbot", "chat bot", "ai assistant", "assistant", "yourself", "who are you", "what are you"],
                    responses: [
                        "I'm Diby, an AI assistant for Dibyadarshi's portfolio website. I'm here to answer questions about his skills, services, and experience.",
                        "I'm a specialized AI chatbot designed to help visitors learn more about Dibyadarshi and his work. How can I assist you today?"
                    ]
                },
                aitools: {
                    keywords: ["ai tools", "copilot", "chatgpt", "claude", "midjourney", "dall-e", "prompt"],
                    responses: [
                        "Dibyadarshi specializes in integrating and teaching modern AI tools like GitHub Copilot, ChatGPT, and Claude to enhance development workflows and boost productivity.",
                        "In his AI-Enhanced Development mentorship, Dibyadarshi teaches effective prompt engineering, GitHub Copilot mastery, AI-powered code reviews, and workflow automation techniques."
                    ]
                },
                timeline: {
                    keywords: ["how long", "timeline", "duration", "time frame", "deadline", "delivery time"],
                    responses: [
                        "Project timelines vary based on complexity and scope, but Dibyadarshi typically delivers small projects within 2-3 weeks and larger projects in 1-3 months. For specific timelines, please contact him directly.",
                        "For mentorship, Dibyadarshi offers programs ranging from 3-6 months depending on your goals and starting point. Many students see significant results within the first 6-8 weeks."
                    ]
                },
                revisions: {
                    keywords: ["revisions", "changes", "edits", "updates", "modify", "adjust"],
                    responses: [
                        "Dibyadarshi includes a reasonable number of revisions in all project quotes to ensure your complete satisfaction with the final deliverables.",
                        "His project process includes dedicated review phases where feedback is incorporated to refine the work until it meets your expectations and requirements."
                    ]
                },
                frontend: {
                    keywords: ["frontend", "front-end", "front end", "ui", "user interface"],
                    responses: [
                        "Frontend development is one of Dibyadarshi's core strengths (90% proficiency), with expertise in HTML (95%), CSS (90%), JavaScript (92%), and React (88%).",
                        "In the Frontend Development Mastery mentorship program, Dibyadarshi covers HTML5, CSS3 & JavaScript fundamentals, React and other frameworks, responsive design & accessibility, and performance optimization techniques."
                    ]
                },
                error: {
                    keywords: ["error", "not working", "broken", "fix", "issue", "problem", "bug", "wrong"],
                    responses: [
                        "I'm currently running in offline mode using a built-in response system. This ensures I can always provide helpful information about Dibyadarshi without service disruptions.",
                        "I'm using a reliable local response system to ensure I can answer your questions about Dibyadarshi without any service disruptions."
                    ]
                },
                design: {
                    keywords: ["design", "ui/ux", "user experience", "interface design", "wireframes", "prototype"],
                    responses: [
                        "Dibyadarshi has strong design skills (75% proficiency) and creates appealing user interfaces with careful attention to user experience principles and modern design trends.",
                        "For design work, Dibyadarshi focuses on creating intuitive, accessible interfaces that balance visual appeal with functionality, as demonstrated in projects like Creative Mantra and Picky."
                    ]
                },
                mobile: {
                    keywords: ["mobile", "responsive", "phone", "tablet", "ios", "android", "app"],
                    responses: [
                        "Dibyadarshi specializes in responsive design that works perfectly across all devices. His websites and applications automatically adapt to different screen sizes and orientations.",
                        "While primarily focused on web applications, Dibyadarshi creates mobile-friendly interfaces and has experience with progressive web apps that provide app-like experiences on mobile devices."
                    ]
                },
                certifications: {
                    keywords: ["certificates", "certifications", "qualified", "courses", "training", "credentials"],
                    responses: [
                        "Beyond formal education, Dibyadarshi continuously updates his skills through professional development and specialized training in the latest web technologies and AI tools.",
                        "Dibyadarshi maintains current knowledge through ongoing professional development, focusing on practical skills that deliver real-world results rather than just collecting certifications."
                    ]
                },
                feedback: {
                    keywords: ["feedback", "improve", "suggestion", "advice", "opinion"],
                    responses: [
                        "Dibyadarshi welcomes constructive feedback throughout the development process and uses it to refine and improve project outcomes.",
                        "Client feedback is a valued part of Dibyadarshi's workflow, with dedicated review stages built into projects to ensure alignment with your expectations."
                    ]
                },
                fallback: {
                    responses: [
                        "That's an interesting question about Dibyadarshi. Could you provide more details so I can better assist you?",
                        "I'd be happy to tell you more about Dibyadarshi's work and expertise. Could you be a bit more specific with your question?",
                        "Thanks for your interest in Dibyadarshi's profile. To provide the most relevant information, could you clarify what you'd like to know?",
                        "I don't have specific details on that aspect of Dibyadarshi's work. Would you like to know about his general approach to projects instead?",
                        "That's beyond my current knowledge about Dibyadarshi. Would you like me to direct you to the contact form so you can ask him directly?",
                        "Dibyadarshi would be the best person to answer that question. Would you like his contact information to reach out directly?",
                        "I'm not sure about that specific detail. Would you like to know about Dibyadarshi's skills, projects, or mentorship offerings instead?",
                        "I don't have enough information to answer that comprehensively. Could we focus on a different aspect of Dibyadarshi's expertise?"
                    ]
                }
            };
            
            // Special handling for greeting at the beginning of conversation
            if (this.conversationHistory.length <= 2 && 
                (lowercaseMsg.includes("hi") || lowercaseMsg.includes("hello") || lowercaseMsg.includes("hey"))) {
                setTimeout(() => {
                    resolve("Hello! I'm Diby, an AI assistant for Dibyadarshi's portfolio website. I can tell you about his skills, experience, and services. How can I help you today?");
                }, 500);
                return;
            }
            
            // Track partial matches for better response quality
            const matchScores = {};
            const words = lowercaseMsg.split(/\s+/);
            
            // Score each category based on keyword matches
            for (const category in mockResponses) {
                if (category === 'fallback') continue;
                
                const keywords = mockResponses[category].keywords;
                if (!keywords) continue;
                
                // Calculate exact phrase matches (higher score)
                const exactMatchScore = keywords.reduce((score, keyword) => {
                    return lowercaseMsg.includes(keyword) ? score + 2 : score;
                }, 0);
                
                // Calculate word-level matches (lower score)
                const wordMatchScore = keywords.reduce((score, keyword) => {
                    // Split multi-word keywords
                    const keywordParts = keyword.split(/\s+/);
                    // Check if any individual word matches
                    for (const part of keywordParts) {
                        if (part.length > 3 && words.includes(part)) {
                            score += 0.5;
                        }
                    }
                    return score;
                }, 0);
                
                // Combine scores
                matchScores[category] = exactMatchScore + wordMatchScore;
            }
            
            // Find best matching category
            let bestCategory = null;
            let highestScore = 0;
            
            for (const category in matchScores) {
                if (matchScores[category] > highestScore) {
                    highestScore = matchScores[category];
                    bestCategory = category;
                }
            }
            
            // Default threshold for a good match
            const matchThreshold = 1;
            
            // Get responses from matched category or fallback
            const responseCategory = (bestCategory && highestScore >= matchThreshold) 
                ? mockResponses[bestCategory] 
                : mockResponses.fallback;
                
            const availableResponses = responseCategory.responses;
            
            // Select random response
            const responseIndex = Math.floor(Math.random() * availableResponses.length);
            
            // Simulate network delay
            setTimeout(() => {
                resolve(availableResponses[responseIndex]);
            }, 500);
        });
    }
    
    // Add a message to the chat
    addMessage(type, content) {
        // Create message container
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}`;
        
        // Create message content
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        // Add text
        const text = document.createElement('p');
        text.textContent = content;
        contentDiv.appendChild(text);
        
        // Add time
        const timeSpan = document.createElement('span');
        timeSpan.className = 'message-time';
        const now = new Date();
        timeSpan.textContent = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        contentDiv.appendChild(timeSpan);
        
        // Assemble and add to chat
        messageDiv.appendChild(contentDiv);
        this.messagesContainer.appendChild(messageDiv);
        
        // Scroll to bottom
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    
    // Show typing indicator
    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message bot typing';
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        this.messagesContainer.appendChild(typingDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        
        return typingDiv;
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create chatbot instance with enhanced local response system
    window.dibyChatbot = new DibyChatbot();
    console.log("Chatbot initialized with enhanced mock response system");
}); 