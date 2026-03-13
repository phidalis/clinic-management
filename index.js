// index.js - Main entry point for home page
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Active link highlighting
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');

    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Animated counters
    const counters = document.querySelectorAll('.counter');
    const speed = 200;
    const statsSection = document.querySelector('.stats');
    let animated = false;

    function animateCounter() {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const increment = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(animateCounter, 1);
            } else {
                counter.innerText = target;
            }
        });
    }

    window.addEventListener('scroll', function() {
        if (!animated && statsSection && statsSection.getBoundingClientRect().top < window.innerHeight) {
            animateCounter();
            animated = true;
        }
    });

    // Navbar background change on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = 'var(--card-bg)';
            navbar.style.backdropFilter = 'none';
        }
    });

    // Initialize localStorage with default data if empty
    initializeLocalStorage();

    // Form submission
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = contactForm.querySelector('input[placeholder="Your Name"]').value;
            const email = contactForm.querySelector('input[placeholder="Your Email"]').value;
            const subject = contactForm.querySelector('input[placeholder="Subject"]').value;
            const message = contactForm.querySelector('textarea').value;
            
            // Store in localStorage
            const contactMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
            contactMessages.push({
                id: 'MSG' + Date.now(),
                name: name,
                email: email,
                subject: subject,
                message: message,
                date: new Date().toISOString().split('T')[0],
                status: 'unread'
            });
            localStorage.setItem('contactMessages', JSON.stringify(contactMessages));
            
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }

    // Initialize localStorage with default data
    function initializeLocalStorage() {
        // Initialize patients array if not exists
        if (!localStorage.getItem('patients')) {
            const defaultPatients = [
                {
                    id: 'P001',
                    name: 'John Smith',
                    age: 45,
                    gender: 'Male',
                    email: 'john.smith@email.com',
                    phone: '(555) 123-4567',
                    address: '123 Main St, New York, NY 10001',
                    bloodGroup: 'O+',
                    emergencyContact: 'Jane Smith (555) 123-4568',
                    registeredDate: '2023-06-15',
                    lastVisit: '2024-01-15',
                    status: 'active',
                    password: 'patient123'
                },
                {
                    id: 'P002',
                    name: 'Emma Wilson',
                    age: 32,
                    gender: 'Female',
                    email: 'emma.wilson@email.com',
                    phone: '(555) 234-5678',
                    address: '456 Oak Ave, New York, NY 10002',
                    bloodGroup: 'A+',
                    emergencyContact: 'Tom Wilson (555) 234-5679',
                    registeredDate: '2023-07-20',
                    lastVisit: '2024-01-14',
                    status: 'active',
                    password: 'patient123'
                },
                {
                    id: 'P003',
                    name: 'Robert Brown',
                    age: 58,
                    gender: 'Male',
                    email: 'robert.brown@email.com',
                    phone: '(555) 345-6789',
                    address: '789 Pine St, New York, NY 10003',
                    bloodGroup: 'B-',
                    emergencyContact: 'Mary Brown (555) 345-6780',
                    registeredDate: '2023-05-10',
                    lastVisit: '2024-01-10',
                    status: 'inactive',
                    password: 'patient123'
                }
            ];
            localStorage.setItem('patients', JSON.stringify(defaultPatients));
        }

        // Initialize doctors array if not exists
        if (!localStorage.getItem('doctors')) {
            const defaultDoctors = [
                {
                    id: 'D001',
                    name: 'Dr. Sarah Johnson',
                    specialty: 'Cardiologist',
                    department: 'Cardiology',
                    email: 'sarah.johnson@hospital.com',
                    phone: '(555) 111-2222',
                    qualification: 'MD, FACC',
                    experience: 15,
                    availability: 'Mon-Wed',
                    status: 'available',
                    patients: 15,
                    fee: 150
                },
                {
                    id: 'D002',
                    name: 'Dr. Michael Chen',
                    specialty: 'Neurologist',
                    department: 'Neurology',
                    email: 'michael.chen@hospital.com',
                    phone: '(555) 222-3333',
                    qualification: 'MD, PhD',
                    experience: 12,
                    availability: 'Tue-Thu',
                    status: 'busy',
                    patients: 22,
                    fee: 200
                },
                {
                    id: 'D003',
                    name: 'Dr. Emily Williams',
                    specialty: 'Pediatrician',
                    department: 'Pediatrics',
                    email: 'emily.williams@hospital.com',
                    phone: '(555) 333-4444',
                    qualification: 'MD, FAAP',
                    experience: 10,
                    availability: 'Mon-Fri',
                    status: 'available',
                    patients: 18,
                    fee: 120
                }
            ];
            localStorage.setItem('doctors', JSON.stringify(defaultDoctors));
        }

        // Initialize appointments array if not exists
        if (!localStorage.getItem('appointments')) {
            const defaultAppointments = [
                {
                    id: 'A001',
                    patientId: 'P001',
                    patientName: 'John Smith',
                    doctorId: 'D001',
                    doctorName: 'Dr. Sarah Johnson',
                    department: 'Cardiology',
                    date: '2024-01-17',
                    time: '09:00 AM',
                    status: 'confirmed',
                    reason: 'Heart checkup',
                    createdAt: '2024-01-10'
                },
                {
                    id: 'A002',
                    patientId: 'P002',
                    patientName: 'Emma Wilson',
                    doctorId: 'D002',
                    doctorName: 'Dr. Michael Chen',
                    department: 'Neurology',
                    date: '2024-01-17',
                    time: '10:30 AM',
                    status: 'pending',
                    reason: 'Headache consultation',
                    createdAt: '2024-01-11'
                }
            ];
            localStorage.setItem('appointments', JSON.stringify(defaultAppointments));
        }

        // Initialize pharmacy inventory if not exists
        if (!localStorage.getItem('pharmacy')) {
            const defaultPharmacy = [
                {
                    id: 'M001',
                    name: 'Amoxicillin',
                    category: 'Antibiotics',
                    stock: 450,
                    price: 12.99,
                    expiry: '2025-06-30',
                    manufacturer: 'PharmaCorp'
                },
                {
                    id: 'M002',
                    name: 'Ibuprofen',
                    category: 'Painkillers',
                    stock: 1200,
                    price: 8.99,
                    expiry: '2025-12-31',
                    manufacturer: 'MediPharm'
                }
            ];
            localStorage.setItem('pharmacy', JSON.stringify(defaultPharmacy));
        }

        // Initialize staff if not exists
        if (!localStorage.getItem('staff')) {
            const defaultStaff = [
                {
                    id: 'S001',
                    name: 'Jennifer Adams',
                    role: 'Receptionist',
                    department: 'Front Desk',
                    email: 'jennifer.a@hospital.com',
                    phone: '(555) 111-2222',
                    status: 'active',
                    joinedDate: '2023-01-15'
                },
                {
                    id: 'S002',
                    name: 'Thomas Wright',
                    role: 'Nurse',
                    department: 'Emergency',
                    email: 'thomas.w@hospital.com',
                    phone: '(555) 222-3333',
                    status: 'active',
                    joinedDate: '2023-03-20'
                }
            ];
            localStorage.setItem('staff', JSON.stringify(defaultStaff));
        }

        // Initialize laboratory tests if not exists
        if (!localStorage.getItem('laboratory')) {
            const defaultLabTests = [
                {
                    id: 'L001',
                    testName: 'Complete Blood Count',
                    patientId: 'P001',
                    patientName: 'John Smith',
                    doctorId: 'D001',
                    doctorName: 'Dr. Sarah Johnson',
                    date: '2024-01-15',
                    status: 'completed',
                    result: 'Normal',
                    notes: 'All parameters within normal range'
                },
                {
                    id: 'L002',
                    testName: 'Lipid Panel',
                    patientId: 'P002',
                    patientName: 'Emma Wilson',
                    doctorId: 'D002',
                    doctorName: 'Dr. Michael Chen',
                    date: '2024-01-16',
                    status: 'in-progress',
                    result: 'Pending',
                    notes: ''
                }
            ];
            localStorage.setItem('laboratory', JSON.stringify(defaultLabTests));
        }

        // Initialize billing if not exists
        if (!localStorage.getItem('billing')) {
            const defaultBilling = [
                {
                    id: 'B001',
                    invoiceNo: 'INV001',
                    patientId: 'P001',
                    patientName: 'John Smith',
                    service: 'Consultation - Cardiology',
                    amount: 150,
                    date: '2024-01-15',
                    status: 'paid',
                    paymentMethod: 'Credit Card'
                },
                {
                    id: 'B002',
                    invoiceNo: 'INV002',
                    patientId: 'P002',
                    patientName: 'Emma Wilson',
                    service: 'Lab Tests - Complete Blood Count',
                    amount: 80,
                    date: '2024-01-16',
                    status: 'pending',
                    paymentMethod: ''
                }
            ];
            localStorage.setItem('billing', JSON.stringify(defaultBilling));
        }

        // Initialize prescriptions if not exists
        if (!localStorage.getItem('prescriptions')) {
            const defaultPrescriptions = [
                {
                    id: 'PR001',
                    patientId: 'P001',
                    patientName: 'John Smith',
                    doctorId: 'D001',
                    doctorName: 'Dr. Sarah Johnson',
                    medicine: 'Lisinopril',
                    dosage: '10mg',
                    instructions: 'Take once daily',
                    date: '2024-01-10',
                    refills: 3,
                    status: 'active'
                },
                {
                    id: 'PR002',
                    patientId: 'P002',
                    patientName: 'Emma Wilson',
                    doctorId: 'D002',
                    doctorName: 'Dr. Michael Chen',
                    medicine: 'Sumatriptan',
                    dosage: '50mg',
                    instructions: 'Take at onset of migraine',
                    date: '2024-01-15',
                    refills: 2,
                    status: 'active'
                }
            ];
            localStorage.setItem('prescriptions', JSON.stringify(defaultPrescriptions));
        }

        // Initialize messages if not exists
        if (!localStorage.getItem('messages')) {
            const defaultMessages = [
                {
                    id: 'M001',
                    senderId: 'D001',
                    senderName: 'Dr. Sarah Johnson',
                    senderRole: 'doctor',
                    receiverId: 'P001',
                    receiverName: 'John Smith',
                    subject: 'Test Results',
                    content: 'Your lab results are ready. Please schedule a follow-up appointment.',
                    date: '2024-01-15',
                    read: false
                },
                {
                    id: 'M002',
                    senderId: 'system',
                    senderName: 'MediCare Pro',
                    senderRole: 'system',
                    receiverId: 'P002',
                    receiverName: 'Emma Wilson',
                    subject: 'Appointment Reminder',
                    content: 'You have an appointment tomorrow at 10:30 AM with Dr. Michael Chen.',
                    date: '2024-01-16',
                    read: true
                }
            ];
            localStorage.setItem('messages', JSON.stringify(defaultMessages));
        }

        // Initialize loggedInUser
        if (!localStorage.getItem('loggedInUser')) {
            localStorage.setItem('loggedInUser', JSON.stringify(null));
        }
    }
});