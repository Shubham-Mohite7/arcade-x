class NotesManager {
    constructor() {
        this.notes = this.getInitialNotes();
        this.subjects = {
            'mathematics': ['Calculus', 'Algebra', 'Statistics', 'Linear Algebra', 'Number Theory'],
            'physics': ['Mechanics', 'Thermodynamics', 'Quantum Physics', 'Electromagnetism', 'Optics'],
            'chemistry': ['Organic', 'Inorganic', 'Physical Chemistry', 'Biochemistry', 'Analytical'],
            'computer_science': ['Data Structures', 'Algorithms', 'Database', 'Web Development', 'AI & ML'],
            'biology': ['Genetics', 'Cell Biology', 'Anatomy', 'Ecology', 'Evolution']
        };
        this.setupEventListeners();
        this.currentFilter = 'all';
        this.renderNotes();
    }

    getInitialNotes() {
        const savedNotes = localStorage.getItem('notes');
        if (savedNotes) return JSON.parse(savedNotes);

        // Pre-defined sample notes
        return [
            {
                id: 1,
                title: "Advanced Data Structures Notes",
                subject: "computer_science",
                module: "Data Structures",
                description: "Complete notes on Trees, Graphs, and Advanced Algorithms with solved examples from my IIT-B lectures.",
                file: "dsa_notes.pdf",
                ratings: [5, 4, 5, 5, 4],
                averageRating: 4.6,
                author: "Arjun Patel",
                downloads: 342,
                timestamp: "2025-09-15T10:30:00Z",
                reviews: [
                    { user: "Priya S.", comment: "Very detailed explanations of complex algorithms!", rating: 5 },
                    { user: "Rahul M.", comment: "Helped me crack my placement interviews", rating: 4 }
                ]
            },
            {
                id: 2,
                title: "Quantum Mechanics Study Material",
                subject: "physics",
                module: "Quantum Physics",
                description: "Comprehensive notes from IIT-Delhi physics lectures covering quantum mechanics fundamentals.",
                file: "quantum_notes.pdf",
                ratings: [5, 5, 5, 4, 5],
                averageRating: 4.8,
                author: "Kavita Sharma",
                downloads: 289,
                timestamp: "2025-09-20T14:15:00Z",
                reviews: [
                    { user: "Amit R.", comment: "Best quantum physics notes ever!", rating: 5 },
                    { user: "Neha K.", comment: "Perfect for JEE Advanced preparation", rating: 5 }
                ]
            },
            {
                id: 3,
                title: "Organic Chemistry Reaction Mechanisms",
                subject: "chemistry",
                module: "Organic",
                description: "Detailed notes on reaction mechanisms with mnemonics from VIT University lectures.",
                file: "organic_chem.pdf",
                ratings: [4, 5, 4, 5, 5],
                averageRating: 4.6,
                author: "Rishi Kumar",
                downloads: 456,
                timestamp: "2025-09-25T09:20:00Z",
                reviews: [
                    { user: "Ananya P.", comment: "Love the mnemonics approach!", rating: 5 },
                    { user: "Karthik S.", comment: "Very helpful for NEET preparation", rating: 4 }
                ]
            },
            {
                id: 4,
                title: "Machine Learning Fundamentals",
                subject: "computer_science",
                module: "AI & ML",
                description: "Complete ML algorithms notes with Python implementations from my BITS Pilani coursework.",
                file: "ml_notes.pdf",
                ratings: [5, 5, 4, 5, 5],
                averageRating: 4.8,
                author: "Sneha Gupta",
                downloads: 523,
                timestamp: "2025-10-01T11:45:00Z",
                reviews: [
                    { user: "Varun M.", comment: "Excellent practical examples!", rating: 5 },
                    { user: "Divya R.", comment: "Perfect blend of theory and code", rating: 5 }
                ]
            },
            {
                id: 5,
                title: "Advanced Calculus and Integration",
                subject: "mathematics",
                module: "Calculus",
                description: "Detailed calculus notes with solved problems from NIT Trichy mathematics department.",
                file: "calculus_advanced.pdf",
                ratings: [4, 5, 5, 4, 5],
                averageRating: 4.6,
                author: "Vikram Reddy",
                downloads: 378,
                timestamp: "2025-10-05T13:30:00Z",
                reviews: [
                    { user: "Ishaan K.", comment: "Solved examples are very helpful!", rating: 5 },
                    { user: "Meera S.", comment: "Great for engineering mathematics", rating: 4 }
                ]
            },
            {
                id: 6,
                title: "Cell Biology and Genetics",
                subject: "biology",
                module: "Cell Biology",
                description: "Comprehensive notes on cell biology and genetics from AIIMS Delhi lectures.",
                file: "cell_bio.pdf",
                ratings: [5, 4, 5, 5, 4],
                averageRating: 4.6,
                author: "Anjali Desai",
                downloads: 412,
                timestamp: "2025-10-10T15:20:00Z",
                reviews: [
                    { user: "Rohan P.", comment: "Perfect for medical entrance prep!", rating: 5 },
                    { user: "Sanya M.", comment: "Detailed diagrams and explanations", rating: 4 }
                ]
            }
        ];
    }

    setupEventListeners() {
        // Upload modal
        const modal = document.getElementById('upload-modal');
        const showUploadBtn = document.getElementById('show-upload-form');
        const closeBtn = document.querySelector('.close-btn');
        const cancelBtn = document.getElementById('cancel-upload');
        const uploadForm = document.getElementById('upload-form');
        const subjectSelect = document.getElementById('subject');
        const fileInput = document.getElementById('file');
        const fileLabel = document.querySelector('.file-upload-label span');

        showUploadBtn.addEventListener('click', () => {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        [closeBtn, cancelBtn].forEach(btn => {
            btn.addEventListener('click', () => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        fileInput.addEventListener('change', (e) => {
            const fileName = e.target.files[0]?.name;
            fileLabel.textContent = fileName || 'Drop your PDF here or click to upload';
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        uploadForm.addEventListener('submit', (e) => this.handleUpload(e));
        subjectSelect.addEventListener('change', (e) => this.updateModules(e.target.value));

        // Rating system
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('star')) {
                this.handleRating(e);
            }
        });

        // Add filter listeners
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.textContent.toLowerCase();
                this.renderNotes();
            });
        });

        // Add sort listeners
        document.getElementById('rating-filter').addEventListener('change', (e) => {
            this.sortNotes(e.target.value);
        });
    }

    handleUpload(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const noteData = {
            id: Date.now(),
            title: formData.get('title'),
            subject: formData.get('subject'),
            module: formData.get('module'),
            description: formData.get('description'),
            file: formData.get('file').name,
            ratings: [],
            averageRating: 0,
            timestamp: new Date().toISOString()
        };

        this.notes.push(noteData);
        this.renderNotes();
        document.getElementById('upload-modal').style.display = 'none';
        e.target.reset();
    }

    handleRating(e) {
        const noteId = e.target.closest('.note-card').dataset.id;
        const rating = parseInt(e.target.dataset.rating);
        const note = this.notes.find(n => n.id === parseInt(noteId));
        
        if (note) {
            note.ratings.push(rating);
            note.averageRating = note.ratings.reduce((a, b) => a + b) / note.ratings.length;
            this.renderNotes();
        }
    }

    updateModules(subject) {
        const moduleSelect = document.getElementById('module');
        moduleSelect.innerHTML = '<option value="">Select Module</option>';
        
        if (this.subjects[subject]) {
            this.subjects[subject].forEach(module => {
                const option = document.createElement('option');
                option.value = module.toLowerCase();
                option.textContent = module;
                moduleSelect.appendChild(option);
            });
        }
    }

    sortNotes(rating) {
        if (rating) {
            this.notes.sort((a, b) => b.averageRating - a.averageRating);
            this.notes = this.notes.filter(note => note.averageRating >= parseInt(rating));
        }
        this.renderNotes();
    }

    renderNotes() {
        const container = document.getElementById('notes-container');
        container.innerHTML = '';

        let displayNotes = [...this.notes];

        // Apply filters
        if (this.currentFilter === 'top rated') {
            displayNotes = displayNotes
                .sort((a, b) => b.averageRating - a.averageRating)
                .slice(0, 6);
        } else if (this.currentFilter === 'my uploads') {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            displayNotes = displayNotes.filter(note => note.author === currentUser.name);
        }

        displayNotes.forEach(note => {
            const stars = '★'.repeat(Math.round(note.averageRating)) + '☆'.repeat(5 - Math.round(note.averageRating));
            const noteElement = document.createElement('div');
            noteElement.className = 'note-card';
            noteElement.dataset.id = note.id;
            noteElement.innerHTML = `
                <div class="note-header">
                    <h3 class="note-title">${note.title}</h3>
                    <div class="rating">${stars} (${note.averageRating.toFixed(1)})</div>
                </div>
                <div class="note-info">
                    <p><strong>Subject:</strong> ${note.subject}</p>
                    <p><strong>Module:</strong> ${note.module}</p>
                    <p>${note.description}</p>
                    <p class="note-meta">
                        <span><i class="fas fa-user"></i> ${note.author}</span>
                        <span><i class="fas fa-download"></i> ${note.downloads}</span>
                        <span><i class="fas fa-calendar"></i> ${new Date(note.timestamp).toLocaleDateString()}</span>
                    </p>
                </div>
                <div class="note-reviews">
                    ${this.renderReviews(note.reviews)}
                </div>
                <div class="note-footer">
                    <div class="rate-this">
                        ${[1,2,3,4,5].map(num => 
                            `<span class="star" data-rating="${num}">★</span>`
                        ).join('')}
                    </div>
                    <button class="btn-secondary download-btn">
                        <i class="fas fa-download"></i> Download
                    </button>
                </div>
            `;
            container.appendChild(noteElement);
        });

        // Update the subject filter options
        this.updateFilterOptions();
    }

    renderReviews(reviews) {
        if (!reviews || reviews.length === 0) return '';
        return `
            <div class="reviews-section">
                <h4>Recent Reviews</h4>
                ${reviews.map(review => `
                    <div class="review">
                        <div class="review-header">
                            <span class="review-author">${review.user}</span>
                            <span class="review-rating">${'★'.repeat(review.rating)}</span>
                        </div>
                        <p class="review-comment">${review.comment}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }

    updateFilterOptions() {
        const subjectFilter = document.getElementById('subject-filter');
        subjectFilter.innerHTML = '<option value="">All Subjects</option>';
        
        // Get unique subjects from notes
        const subjects = [...new Set(this.notes.map(note => note.subject))];
        subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject;
            option.textContent = subject.charAt(0).toUpperCase() + subject.slice(1);
            subjectFilter.appendChild(option);
        });
    }

    // ... rest of the existing methods ...
}

// Initialize the notes manager
const notesManager = new NotesManager();