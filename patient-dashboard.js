// patient-dashboard.js
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const loggedInPatient = JSON.parse(localStorage.getItem('loggedInPatient'));
    
    if (!loggedInPatient) {
        // Redirect to login if not logged in
        window.location.href = 'patient-login.html';
        return;
    }

    // Update patient name in UI
    updatePatientInfo(loggedInPatient);

    // Sidebar Toggle
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
        });
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            sidebar.classList.toggle('show');
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 1024) {
            if (sidebar && !sidebar.contains(e.target) && mobileMenuBtn && !mobileMenuBtn.contains(e.target)) {
                sidebar.classList.remove('show');
            }
        }
    });

    // Profile Dropdown
    const profileToggle = document.getElementById('profileToggle');
    const dropdownMenu = document.getElementById('dropdownMenu');

    if (profileToggle) {
        profileToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });
    }

    document.addEventListener('click', function(e) {
        if (dropdownMenu && profileToggle && !profileToggle.contains(e.target)) {
            dropdownMenu.classList.remove('show');
        }
    });

    // Tab Switching
    const menuItems = document.querySelectorAll('.menu-item[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');
    const pageTitle = document.getElementById('pageTitle');
    const pageSubtitle = document.getElementById('pageSubtitle');

    if (menuItems.length > 0) {
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Update active menu item
                menuItems.forEach(mi => mi.classList.remove('active'));
                this.classList.add('active');
                
                // Update active tab
                tabContents.forEach(tab => tab.classList.remove('active'));
                const activeTab = document.getElementById(`${tabId}-tab`);
                if (activeTab) {
                    activeTab.classList.add('active');
                }
                
                // Update page title
                const titleMap = {
                    'dashboard': 'Dashboard',
                    'appointments': 'My Appointments',
                    'medical-records': 'Medical Records',
                    'prescriptions': 'Prescriptions',
                    'lab-results': 'Lab Results',
                    'doctors': 'Doctors Directory',
                    'billing': 'Billing & Payments',
                    'messages': 'Messages',
                    'settings': 'Settings'
                };
                
                if (pageTitle) {
                    pageTitle.textContent = titleMap[tabId] || 'Dashboard';
                }
                if (pageSubtitle) {
                    pageSubtitle.textContent = `Welcome back, ${loggedInPatient.name}!`;
                }
                
                // Load tab-specific data
                loadTabData(tabId, loggedInPatient);
                
                // Close sidebar on mobile
                if (window.innerWidth <= 1024) {
                    sidebar.classList.remove('show');
                }
            });
        });
    }

    // View All links
    document.querySelectorAll('.view-all').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tab = this.getAttribute('data-tab');
            const targetMenuItem = document.querySelector(`.menu-item[data-tab="${tab}"]`);
            if (targetMenuItem) {
                targetMenuItem.click();
            }
        });
    });

    // Load dashboard data initially
    loadDashboardData(loggedInPatient);

    // Modal Functions
    const modal = document.getElementById('appointmentModal');
    const bookBtn = document.getElementById('bookAppointmentBtn');
    const closeBtns = document.querySelectorAll('.close-modal');

    if (bookBtn) {
        bookBtn.addEventListener('click', function() {
            populateDoctorSelect();
            if (modal) {
                modal.classList.add('show');
            }
        });
    }

    if (closeBtns.length > 0) {
        closeBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                if (modal) {
                    modal.classList.remove('show');
                }
            });
        });
    }

    window.addEventListener('click', function(e) {
        if (modal && e.target === modal) {
            modal.classList.remove('show');
        }
    });

    // Doctor selection in modal
    const doctorSelect = document.getElementById('doctorSelect');
    if (doctorSelect) {
        doctorSelect.addEventListener('change', function(e) {
            const doctors = JSON.parse(localStorage.getItem('doctors')) || [];
            const selectedDoctor = doctors.find(d => d.id === e.target.value);
            const departmentDisplay = document.getElementById('departmentDisplay');
            if (selectedDoctor && departmentDisplay) {
                departmentDisplay.value = selectedDoctor.department;
            }
        });
    }

    // Confirm Appointment
    const confirmBtn = document.getElementById('confirmAppointment');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            bookAppointment(loggedInPatient);
        });
    }

    // Search and Filter Functions
    const appointmentSearch = document.getElementById('appointmentSearch');
    const appointmentFilter = document.getElementById('appointmentFilter');

    if (appointmentSearch) {
        appointmentSearch.addEventListener('input', function() {
            filterAppointments(this.value, appointmentFilter ? appointmentFilter.value : 'all');
        });
    }

    if (appointmentFilter) {
        appointmentFilter.addEventListener('change', function() {
            filterAppointments(appointmentSearch ? appointmentSearch.value : '', this.value);
        });
    }

    // Doctor search
    const doctorSearch = document.getElementById('doctorSearch');
    const specialtyFilter = document.getElementById('specialtyFilter');

    if (doctorSearch) {
        doctorSearch.addEventListener('input', function() {
            filterDoctors(this.value, specialtyFilter ? specialtyFilter.value : 'all');
        });
    }

    if (specialtyFilter) {
        specialtyFilter.addEventListener('change', function() {
            filterDoctors(doctorSearch ? doctorSearch.value : '', this.value);
        });
    }

    // Form submissions
    const personalInfoForm = document.getElementById('personalInfoForm');
    if (personalInfoForm) {
        personalInfoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updatePersonalInfo(loggedInPatient);
        });
    }

    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updatePassword(loggedInPatient);
        });
    }

    // Logout
    const logoutBtn = document.querySelector('.menu-item.logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('loggedInPatient');
                window.location.href = 'home.html';
            }
        });
    }

    // Load initial data
    function loadDashboardData(patient) {
        // Update upcoming appointment
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const upcomingAppointments = appointments.filter(apt => 
            apt.patientId === patient.id && 
            apt.status !== 'cancelled' &&
            apt.status !== 'completed' &&
            apt.date >= new Date().toISOString().split('T')[0]
        ).sort((a, b) => a.date.localeCompare(b.date));

        const upcomingStat = document.querySelector('.stat-card:first-child .stat-value');
        if (upcomingStat) {
            if (upcomingAppointments.length > 0) {
                const nextApt = upcomingAppointments[0];
                upcomingStat.textContent = `${nextApt.date} ${nextApt.time}`;
            } else {
                upcomingStat.textContent = 'No upcoming';
            }
        }

        // Update total visits
        const totalVisits = appointments.filter(apt => 
            apt.patientId === patient.id && apt.status === 'completed'
        ).length;
        
        const visitsStat = document.querySelector('.stat-card:nth-child(2) .stat-value');
        if (visitsStat) {
            visitsStat.textContent = totalVisits;
        }

        // Update active prescriptions
        const prescriptions = JSON.parse(localStorage.getItem('prescriptions')) || [];
        const activePrescriptions = prescriptions.filter(pres => 
            pres.patientId === patient.id && pres.status === 'active'
        ).length;
        
        const presStat = document.querySelector('.stat-card:nth-child(3) .stat-value');
        if (presStat) {
            presStat.textContent = activePrescriptions;
        }

        // Update pending lab results
        const labTests = JSON.parse(localStorage.getItem('laboratory')) || [];
        const pendingTests = labTests.filter(test => 
            test.patientId === patient.id && test.status === 'pending'
        ).length;
        
        const labStat = document.querySelector('.stat-card:nth-child(4) .stat-value');
        if (labStat) {
            labStat.textContent = pendingTests;
        }

        // Populate recent appointments
        populateRecentAppointments(patient);
        
        // Populate recent prescriptions
        populateRecentPrescriptions(patient);
    }

    function loadTabData(tabId, patient) {
        switch(tabId) {
            case 'appointments':
                populateAppointmentsTable(patient);
                break;
            case 'medical-records':
                populateMedicalRecords(patient);
                break;
            case 'prescriptions':
                populatePrescriptionsTable(patient);
                break;
            case 'lab-results':
                populateLabResultsTable(patient);
                break;
            case 'doctors':
                populateDoctorsGrid();
                break;
            case 'billing':
                populateBillingTable(patient);
                break;
            case 'messages':
                populateMessagesList(patient);
                break;
            case 'settings':
                populateSettingsForm(patient);
                break;
        }
    }

    // Populate Recent Appointments
    function populateRecentAppointments(patient) {
        const tbody = document.getElementById('recentAppointments');
        if (!tbody) return;
        
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const patientAppointments = appointments
            .filter(apt => apt.patientId === patient.id)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3);
        
        if (patientAppointments.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No appointments found</td></tr>';
            return;
        }
        
        tbody.innerHTML = patientAppointments.map(apt => `
            <tr>
                <td>${apt.doctorName}</td>
                <td>${apt.department}</td>
                <td>${apt.date}</td>
                <td>${apt.time}</td>
                <td><span class="status-badge status-${apt.status}">${apt.status}</span></td>
                <td>
                    <button class="action-btn view" onclick="viewAppointment('${apt.id}')"><i class="fas fa-eye"></i></button>
                    ${apt.status === 'confirmed' ? `
                        <button class="action-btn reschedule" onclick="rescheduleAppointment('${apt.id}')"><i class="fas fa-calendar-alt"></i></button>
                        <button class="action-btn cancel" onclick="cancelAppointment('${apt.id}')"><i class="fas fa-times"></i></button>
                    ` : ''}
                </td>
            </tr>
        `).join('');
    }

    // Populate Recent Prescriptions
    function populateRecentPrescriptions(patient) {
        const recentDiv = document.getElementById('recentPrescriptions');
        if (!recentDiv) return;
        
        const prescriptions = JSON.parse(localStorage.getItem('prescriptions')) || [];
        const patientPrescriptions = prescriptions
            .filter(pres => pres.patientId === patient.id)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3);
        
        if (patientPrescriptions.length === 0) {
            recentDiv.innerHTML = '<p style="text-align: center; color: #666;">No prescriptions found</p>';
            return;
        }
        
        recentDiv.innerHTML = patientPrescriptions.map(pres => `
            <div class="prescription-card" style="
                background: var(--background);
                padding: 1rem;
                margin-bottom: 1rem;
                border-radius: 8px;
                border-left: 4px solid var(--primary);
            ">
                <h4 style="margin-bottom: 0.5rem;">${pres.medicine}</h4>
                <p style="margin-bottom: 0.25rem;"><strong>Dr.</strong> ${pres.doctorName}</p>
                <p style="margin-bottom: 0.25rem;"><strong>Dosage:</strong> ${pres.dosage}</p>
                <p style="margin-bottom: 0.25rem;"><strong>Instructions:</strong> ${pres.instructions}</p>
                <small style="color: #666;">${pres.date}</small>
            </div>
        `).join('');
    }

    // Populate Appointments Table
    function populateAppointmentsTable(patient) {
        const tbody = document.getElementById('appointmentsTable');
        if (!tbody) return;
        
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const patientAppointments = appointments
            .filter(apt => apt.patientId === patient.id)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (patientAppointments.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No appointments found</td></tr>';
            return;
        }
        
        tbody.innerHTML = patientAppointments.map(apt => `
            <tr>
                <td>${apt.doctorName}</td>
                <td>${apt.department}</td>
                <td>${apt.date}</td>
                <td>${apt.time}</td>
                <td><span class="status-badge status-${apt.status}">${apt.status}</span></td>
                <td>
                    <button class="action-btn view" onclick="viewAppointment('${apt.id}')"><i class="fas fa-eye"></i></button>
                    ${apt.status === 'confirmed' ? `
                        <button class="action-btn reschedule" onclick="rescheduleAppointment('${apt.id}')"><i class="fas fa-calendar-alt"></i></button>
                        <button class="action-btn cancel" onclick="cancelAppointment('${apt.id}')"><i class="fas fa-times"></i></button>
                    ` : ''}
                </td>
            </tr>
        `).join('');
    }

    // Populate Medical Records
    function populateMedicalRecords(patient) {
        const tbody = document.getElementById('medicalRecordsTable');
        if (!tbody) return;
        
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const completedAppointments = appointments
            .filter(apt => apt.patientId === patient.id && apt.status === 'completed')
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (completedAppointments.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No medical records found</td></tr>';
            return;
        }
        
        tbody.innerHTML = completedAppointments.map((apt, index) => `
            <tr>
                <td>MR${String(index + 1).padStart(3, '0')}</td>
                <td>${apt.doctorName}</td>
                <td>${apt.reason || 'General Consultation'}</td>
                <td>Prescribed treatment</td>
                <td>${apt.date}</td>
                <td>
                    <button class="action-btn view" onclick="viewRecord('MR${String(index + 1).padStart(3, '0')}')"><i class="fas fa-eye"></i></button>
                </td>
            </tr>
        `).join('');
    }

    // Populate Prescriptions Table
    function populatePrescriptionsTable(patient) {
        const tbody = document.getElementById('prescriptionsTable');
        if (!tbody) return;
        
        const prescriptions = JSON.parse(localStorage.getItem('prescriptions')) || [];
        const patientPrescriptions = prescriptions
            .filter(pres => pres.patientId === patient.id)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (patientPrescriptions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No prescriptions found</td></tr>';
            return;
        }
        
        tbody.innerHTML = patientPrescriptions.map(pres => `
            <tr>
                <td>${pres.doctorName}</td>
                <td>${pres.medicine}</td>
                <td>${pres.dosage}</td>
                <td>${pres.instructions}</td>
                <td>${pres.date}</td>
                <td>
                    <button class="action-btn download" onclick="downloadPrescription('${pres.id}')"><i class="fas fa-download"></i></button>
                </td>
            </tr>
        `).join('');
    }

    // Populate Lab Results Table
    function populateLabResultsTable(patient) {
        const tbody = document.getElementById('labResultsTable');
        if (!tbody) return;
        
        const labTests = JSON.parse(localStorage.getItem('laboratory')) || [];
        const patientTests = labTests
            .filter(test => test.patientId === patient.id)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (patientTests.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No lab results found</td></tr>';
            return;
        }
        
        tbody.innerHTML = patientTests.map(test => `
            <tr>
                <td>${test.testName}</td>
                <td>${test.doctorName}</td>
                <td>${test.date}</td>
                <td><span class="status-badge status-${test.status}">${test.status}</span></td>
                <td>
                    ${test.status === 'completed' ? 
                        `<button class="action-btn download" onclick="downloadReport('${test.id}')"><i class="fas fa-download"></i></button>` : 
                        '<span style="color: #666;">Pending</span>'}
                </td>
            </tr>
        `).join('');
    }

    // Populate Doctors Grid
    function populateDoctorsGrid() {
        const grid = document.getElementById('doctorsGrid');
        if (!grid) return;
        
        const doctors = JSON.parse(localStorage.getItem('doctors')) || [];
        
        if (doctors.length === 0) {
            grid.innerHTML = '<p style="text-align: center; color: #666; grid-column: 1/-1;">No doctors found</p>';
            return;
        }
        
        grid.innerHTML = doctors.map(doc => `
            <div class="doctor-card">
                <div class="doctor-avatar">
                    <i class="fas fa-user-md"></i>
                </div>
                <h3>${doc.name}</h3>
                <p class="doctor-specialty">${doc.specialty}</p>
                <p class="doctor-availability">Experience: ${doc.experience} years</p>
                <p style="color: var(--secondary); margin-bottom: 1rem;">Fee: $${doc.fee}</p>
                <button class="book-btn" onclick="openBookModal('${doc.id}')">Book Appointment</button>
            </div>
        `).join('');
    }

    // Populate Billing Table
    function populateBillingTable(patient) {
        const tbody = document.getElementById('billingTable');
        if (!tbody) return;
        
        const billing = JSON.parse(localStorage.getItem('billing')) || [];
        const patientBilling = billing
            .filter(bill => bill.patientId === patient.id)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (patientBilling.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No billing records found</td></tr>';
            return;
        }
        
        tbody.innerHTML = patientBilling.map(bill => `
            <tr>
                <td>${bill.invoiceNo}</td>
                <td>${bill.service}</td>
                <td>$${bill.amount}</td>
                <td>${bill.date}</td>
                <td><span class="status-badge status-${bill.status}">${bill.status}</span></td>
                <td>
                    <button class="action-btn download" onclick="downloadInvoice('${bill.id}')"><i class="fas fa-download"></i> Invoice</button>
                </td>
            </tr>
        `).join('');
    }

    // Populate Messages List
    function populateMessagesList(patient) {
        const messagesList = document.getElementById('messagesList');
        if (!messagesList) return;
        
        const messages = JSON.parse(localStorage.getItem('messages')) || [];
        const patientMessages = messages
            .filter(msg => msg.receiverId === patient.id)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (patientMessages.length === 0) {
            messagesList.innerHTML = '<div style="text-align: center; padding: 2rem;">No messages found</div>';
            return;
        }
        
        messagesList.innerHTML = patientMessages.map(msg => `
            <div class="message-item ${!msg.read ? 'unread' : ''}" onclick="showMessage('${msg.id}')" style="
                padding: 1rem;
                border-bottom: 1px solid var(--border);
                cursor: pointer;
                background: ${!msg.read ? 'rgba(42, 125, 225, 0.05)' : 'transparent'};
            ">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span style="font-weight: 600;">${msg.senderName}</span>
                    <span style="font-size: 0.8rem; color: var(--text-light);">${msg.date}</span>
                </div>
                <div style="font-weight: 500; margin-bottom: 0.25rem;">${msg.subject}</div>
                <div style="font-size: 0.9rem; color: var(--text-light); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    ${msg.content.substring(0, 50)}...
                </div>
            </div>
        `).join('');
    }

    // Populate Settings Form
    function populateSettingsForm(patient) {
        const fullNameInput = document.querySelector('#personalInfoForm input[value]');
        const emailInput = document.querySelector('#personalInfoForm input[type="email"]');
        const phoneInput = document.querySelector('#personalInfoForm input[type="tel"]');
        const dobInput = document.querySelector('#personalInfoForm input[type="date"]');
        const addressInput = document.querySelector('#personalInfoForm input[placeholder*="Address"]');

        if (fullNameInput) fullNameInput.value = patient.name;
        if (emailInput) emailInput.value = patient.email;
        if (phoneInput) phoneInput.value = patient.phone;
        if (dobInput) dobInput.value = patient.dob;
        if (addressInput) addressInput.value = patient.address;
    }

    // Populate Doctor Select for Modal
    function populateDoctorSelect() {
        const select = document.getElementById('doctorSelect');
        if (!select) return;
        
        const doctors = JSON.parse(localStorage.getItem('doctors')) || [];
        select.innerHTML = '<option value="">Choose a doctor...</option>' + 
            doctors.map(doc => `<option value="${doc.id}">${doc.name} - ${doc.specialty}</option>`).join('');
    }

    // Book Appointment
    function bookAppointment(patient) {
        const doctorId = document.getElementById('doctorSelect')?.value;
        const date = document.getElementById('appointmentDate')?.value;
        const time = document.getElementById('appointmentTime')?.value;
        const reason = document.querySelector('#appointmentForm textarea')?.value;

        if (!doctorId || !date || !time || !reason) {
            alert('Please fill in all fields');
            return;
        }

        const doctors = JSON.parse(localStorage.getItem('doctors')) || [];
        const doctor = doctors.find(d => d.id === doctorId);
        
        if (!doctor) {
            alert('Please select a valid doctor');
            return;
        }

        // Create new appointment
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const newAppointment = {
            id: 'A' + Date.now().toString().slice(-6),
            patientId: patient.id,
            patientName: patient.name,
            doctorId: doctor.id,
            doctorName: doctor.name,
            department: doctor.department,
            date: date,
            time: time,
            status: 'pending',
            reason: reason,
            createdAt: new Date().toISOString().split('T')[0]
        };

        appointments.push(newAppointment);
        localStorage.setItem('appointments', JSON.stringify(appointments));

        // Send confirmation message
        const messages = JSON.parse(localStorage.getItem('messages')) || [];
        messages.push({
            id: 'M' + Date.now().toString().slice(-6),
            senderId: 'system',
            senderName: 'MediCare Pro',
            senderRole: 'system',
            receiverId: patient.id,
            receiverName: patient.name,
            subject: 'Appointment Confirmation',
            content: `Your appointment with ${doctor.name} on ${date} at ${time} has been scheduled and is pending confirmation.`,
            date: new Date().toISOString().split('T')[0],
            read: false
        });
        localStorage.setItem('messages', JSON.stringify(messages));

        alert('Appointment booked successfully!');
        
        const modal = document.getElementById('appointmentModal');
        if (modal) {
            modal.classList.remove('show');
        }
        
        // Reset form
        document.getElementById('appointmentForm')?.reset();
        
        // Refresh appointments tab if active
        const appointmentsTab = document.getElementById('appointments-tab');
        if (appointmentsTab && appointmentsTab.classList.contains('active')) {
            populateAppointmentsTable(patient);
        }
        
        // Refresh dashboard if active
        const dashboardTab = document.getElementById('dashboard-tab');
        if (dashboardTab && dashboardTab.classList.contains('active')) {
            loadDashboardData(patient);
        }
    }

    // Filter Appointments
    function filterAppointments(search, filter) {
        const rows = document.querySelectorAll('#appointmentsTable tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const statusElement = row.querySelector('.status-badge');
            const status = statusElement ? statusElement.textContent.toLowerCase() : '';
            
            const matchesSearch = search === '' || text.includes(search.toLowerCase());
            const matchesFilter = filter === 'all' || status === filter;
            
            row.style.display = matchesSearch && matchesFilter ? '' : 'none';
        });
    }

    // Filter Doctors
    function filterDoctors(search, specialty) {
        const cards = document.querySelectorAll('.doctor-card');
        cards.forEach(card => {
            const name = card.querySelector('h3')?.textContent.toLowerCase() || '';
            const specialtyText = card.querySelector('.doctor-specialty')?.textContent.toLowerCase() || '';
            
            const matchesSearch = search === '' || name.includes(search.toLowerCase());
            const matchesSpecialty = specialty === 'all' || specialtyText.includes(specialty);
            
            card.style.display = matchesSearch && matchesSpecialty ? '' : 'none';
        });
    }

    // Update Personal Info
    function updatePersonalInfo(patient) {
        const name = document.querySelector('#personalInfoForm input[placeholder*="Full"]')?.value;
        const email = document.querySelector('#personalInfoForm input[type="email"]')?.value;
        const phone = document.querySelector('#personalInfoForm input[type="tel"]')?.value;
        const dob = document.querySelector('#personalInfoForm input[type="date"]')?.value;
        const address = document.querySelector('#personalInfoForm input[placeholder*="Address"]')?.value;

        if (!name || !email || !phone || !dob || !address) {
            alert('Please fill in all fields');
            return;
        }

        // Update patient in localStorage
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const patientIndex = patients.findIndex(p => p.id === patient.id);
        
        if (patientIndex !== -1) {
            patients[patientIndex] = {
                ...patients[patientIndex],
                name: name,
                email: email,
                phone: phone,
                dob: dob,
                address: address,
                age: calculateAge(dob)
            };
            
            localStorage.setItem('patients', JSON.stringify(patients));
            localStorage.setItem('loggedInPatient', JSON.stringify(patients[patientIndex]));
            
            alert('Personal information updated successfully!');
            updatePatientInfo(patients[patientIndex]);
        }
    }

    // Update Password
    function updatePassword(patient) {
        const currentPassword = document.querySelector('#passwordForm input[type="password"]')?.value;
        const newPassword = document.querySelectorAll('#passwordForm input[type="password"]')[1]?.value;
        const confirmPassword = document.querySelectorAll('#passwordForm input[type="password"]')[2]?.value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            alert('Please fill in all password fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }

        // Verify current password
        if (currentPassword !== patient.password) {
            alert('Current password is incorrect');
            return;
        }

        // Update password
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const patientIndex = patients.findIndex(p => p.id === patient.id);
        
        if (patientIndex !== -1) {
            patients[patientIndex].password = newPassword;
            localStorage.setItem('patients', JSON.stringify(patients));
            
            const updatedPatient = { ...patient, password: newPassword };
            localStorage.setItem('loggedInPatient', JSON.stringify(updatedPatient));
            
            alert('Password updated successfully!');
            
            // Clear password fields
            document.querySelectorAll('#passwordForm input[type="password"]').forEach(input => {
                input.value = '';
            });
        }
    }

    // Update patient info in UI
    function updatePatientInfo(patient) {
        const patientNameElements = document.querySelectorAll('.profile-text .name, .page-title p');
        patientNameElements.forEach(el => {
            if (el.classList.contains('name')) {
                el.textContent = patient.name;
            } else if (el.classList.contains('page-title')) {
                // Skip or handle differently
            } else {
                el.textContent = `Welcome back, ${patient.name}!`;
            }
        });
    }

    // Calculate age helper
    function calculateAge(dob) {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    // Global functions for buttons
    window.viewAppointment = function(id) {
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const appointment = appointments.find(a => a.id === id);
        alert(`Viewing appointment with ${appointment?.doctorName} on ${appointment?.date}`);
    };

    window.rescheduleAppointment = function(id) {
        alert('Rescheduling feature would open calendar modal');
    };

    window.cancelAppointment = function(id) {
        if (confirm('Are you sure you want to cancel this appointment?')) {
            const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
            const index = appointments.findIndex(a => a.id === id);
            
            if (index !== -1) {
                appointments[index].status = 'cancelled';
                localStorage.setItem('appointments', JSON.stringify(appointments));
                
                // Refresh the appointments table
                const patient = JSON.parse(localStorage.getItem('loggedInPatient'));
                populateAppointmentsTable(patient);
                
                alert('Appointment cancelled successfully');
            }
        }
    };

    window.viewRecord = function(id) {
        alert(`Viewing medical record ${id}`);
    };

    window.downloadPrescription = function(id) {
        const prescriptions = JSON.parse(localStorage.getItem('prescriptions')) || [];
        const prescription = prescriptions.find(p => p.id === id);
        alert(`Downloading prescription for ${prescription?.medicine}`);
    };

    window.downloadReport = function(id) {
        alert('Downloading lab report');
    };

    window.downloadInvoice = function(id) {
        alert('Downloading invoice');
    };

    window.openBookModal = function(doctorId) {
        const modal = document.getElementById('appointmentModal');
        if (modal) {
            populateDoctorSelect();
            const select = document.getElementById('doctorSelect');
            if (select && doctorId) {
                select.value = doctorId;
                // Trigger change event to populate department
                const event = new Event('change');
                select.dispatchEvent(event);
            }
            modal.classList.add('show');
        }
    };

    window.showMessage = function(id) {
        const messages = JSON.parse(localStorage.getItem('messages')) || [];
        const message = messages.find(m => m.id === id);
        
        if (message) {
            // Mark as read
            if (!message.read) {
                message.read = true;
                localStorage.setItem('messages', JSON.stringify(messages));
            }
            
            const messageDetail = document.getElementById('messageDetail');
            if (messageDetail) {
                messageDetail.innerHTML = `
                    <div style="padding: 2rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 2rem;">
                            <div>
                                <h3 style="margin-bottom: 0.5rem;">${message.subject}</h3>
                                <p style="color: var(--text-light);">From: ${message.senderName}</p>
                            </div>
                            <span style="color: var(--text-light);">${message.date}</span>
                        </div>
                        <div style="background: var(--background); padding: 2rem; border-radius: 10px;">
                            <p style="line-height: 1.8;">${message.content}</p>
                        </div>
                        <div style="margin-top: 2rem;">
                            <button class="btn-primary" onclick="replyToMessage('${id}')">Reply</button>
                        </div>
                    </div>
                `;
            }
            
            // Refresh messages list
            const patient = JSON.parse(localStorage.getItem('loggedInPatient'));
            populateMessagesList(patient);
        }
    };

    window.replyToMessage = function(id) {
        alert('Reply functionality would open message composition modal');
    };
});