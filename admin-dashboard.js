// admin-dashboard.js
document.addEventListener('DOMContentLoaded', function() {
    // Check if admin is authenticated
    const adminAuthenticated = localStorage.getItem('adminAuthenticated');
    
    if (!adminAuthenticated) {
        // Redirect to admin login if not authenticated
        window.location.href = 'admin-login.html';
        return;
    }

    // ==================== SIDEBAR FUNCTIONALITY ====================
    const sidebar = document.getElementById('adminSidebar');
    const sidebarToggle = document.getElementById('adminSidebarToggle');
    const mobileMenuBtn = document.getElementById('adminMobileMenuBtn');

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

    // ==================== PROFILE DROPDOWN ====================
    const profileToggle = document.getElementById('adminProfileToggle');
    const profileDropdown = document.getElementById('adminProfileDropdown');

    if (profileToggle) {
        profileToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            profileDropdown.classList.toggle('show');
        });
    }

    document.addEventListener('click', function(e) {
        if (profileDropdown && profileToggle && !profileToggle.contains(e.target)) {
            profileDropdown.classList.remove('show');
        }
    });

    // ==================== TAB SWITCHING ====================
    const menuItems = document.querySelectorAll('.admin-menu-item[data-admin-tab]');
    const tabContents = document.querySelectorAll('.admin-tab');
    const pageTitle = document.getElementById('adminPageTitle');
    const pageSubtitle = document.getElementById('adminPageSubtitle');

    if (menuItems.length > 0) {
        menuItems.forEach(function(item) {
            item.addEventListener('click', function() {
                const tabId = this.getAttribute('data-admin-tab');
                
                // Update active menu item
                menuItems.forEach(function(mi) {
                    mi.classList.remove('active');
                });
                this.classList.add('active');
                
                // Update active tab
                tabContents.forEach(function(tab) {
                    tab.classList.remove('active');
                });
                const activeTab = document.getElementById('admin-' + tabId + '-tab');
                if (activeTab) {
                    activeTab.classList.add('active');
                }
                
                // Update page title
                const titleMap = {
                    'dashboard': 'Dashboard',
                    'patients': 'Patient Management',
                    'appointments': 'Appointment Management',
                    'doctors': 'Doctor Management',
                    'pharmacy': 'Pharmacy Inventory',
                    'laboratory': 'Laboratory Management',
                    'staff': 'Staff Management',
                    'reports': 'Reports & Analytics',
                    'settings': 'Settings'
                };
                
                if (pageTitle) {
                    pageTitle.textContent = titleMap[tabId] || 'Dashboard';
                }
                if (pageSubtitle) {
                    pageSubtitle.textContent = 'Welcome back, Administrator';
                }
                
                // Load tab-specific data
                loadAdminTabData(tabId);
                
                // Close sidebar on mobile
                if (window.innerWidth <= 1024) {
                    sidebar.classList.remove('show');
                }
            });
        });
    }

    // Load dashboard data initially
    loadDashboardStats();

    // ==================== MODAL FUNCTIONALITY ====================
    const addPatientModal = document.getElementById('addPatientModal');
    const addDoctorModal = document.getElementById('addDoctorModal');
    const addMedicineModal = document.getElementById('addMedicineModal');
    const addStaffModal = document.getElementById('addStaffModal');
    const deleteConfirmModal = document.getElementById('deleteConfirmModal');
    
    const modalCloseBtns = document.querySelectorAll('.admin-modal-close');
    
    // Open modals
    const addPatientBtn = document.getElementById('addPatientBtn');
    if (addPatientBtn) {
        addPatientBtn.addEventListener('click', function() {
            if (addPatientModal) {
                resetPatientForm();
                addPatientModal.classList.add('show');
            }
        });
    }

    const addDoctorBtn = document.getElementById('addDoctorBtn');
    if (addDoctorBtn) {
        addDoctorBtn.addEventListener('click', function() {
            if (addDoctorModal) {
                resetDoctorForm();
                addDoctorModal.classList.add('show');
            }
        });
    }

    const addMedicineBtn = document.getElementById('addMedicineBtn');
    if (addMedicineBtn) {
        addMedicineBtn.addEventListener('click', function() {
            if (addMedicineModal) {
                resetMedicineForm();
                addMedicineModal.classList.add('show');
            }
        });
    }

    const addStaffBtn = document.getElementById('addStaffBtn');
    if (addStaffBtn) {
        addStaffBtn.addEventListener('click', function() {
            if (addStaffModal) {
                resetStaffForm();
                addStaffModal.classList.add('show');
            }
        });
    }

    // Close modals
    if (modalCloseBtns.length > 0) {
        for (let i = 0; i < modalCloseBtns.length; i++) {
            modalCloseBtns[i].addEventListener('click', function() {
                if (addPatientModal) addPatientModal.classList.remove('show');
                if (addDoctorModal) addDoctorModal.classList.remove('show');
                if (addMedicineModal) addMedicineModal.classList.remove('show');
                if (addStaffModal) addStaffModal.classList.remove('show');
                if (deleteConfirmModal) deleteConfirmModal.classList.remove('show');
            });
        }
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (addPatientModal && e.target === addPatientModal) {
            addPatientModal.classList.remove('show');
        }
        if (addDoctorModal && e.target === addDoctorModal) {
            addDoctorModal.classList.remove('show');
        }
        if (addMedicineModal && e.target === addMedicineModal) {
            addMedicineModal.classList.remove('show');
        }
        if (addStaffModal && e.target === addStaffModal) {
            addStaffModal.classList.remove('show');
        }
        if (deleteConfirmModal && e.target === deleteConfirmModal) {
            deleteConfirmModal.classList.remove('show');
        }
    });

    // ==================== FORM SUBMISSIONS ====================
    const savePatientBtn = document.getElementById('savePatientBtn');
    if (savePatientBtn) {
        savePatientBtn.addEventListener('click', function() {
            saveNewPatient();
        });
    }

    const saveDoctorBtn = document.getElementById('saveDoctorBtn');
    if (saveDoctorBtn) {
        saveDoctorBtn.addEventListener('click', function() {
            saveNewDoctor();
        });
    }

    const saveMedicineBtn = document.getElementById('saveMedicineBtn');
    if (saveMedicineBtn) {
        saveMedicineBtn.addEventListener('click', function() {
            saveNewMedicine();
        });
    }

    const saveStaffBtn = document.getElementById('saveStaffBtn');
    if (saveStaffBtn) {
        saveStaffBtn.addEventListener('click', function() {
            saveNewStaff();
        });
    }

    // Settings forms
    const generalSettingsForm = document.getElementById('generalSettingsForm');
    if (generalSettingsForm) {
        generalSettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveGeneralSettings();
        });
    }

    const workingHoursForm = document.getElementById('workingHoursForm');
    if (workingHoursForm) {
        workingHoursForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveWorkingHours();
        });
    }

    // ==================== SETTINGS TABS ====================
    const settingsItems = document.querySelectorAll('.admin-settings-item');
    const settingsPanels = document.querySelectorAll('.admin-settings-panel');

    if (settingsItems.length > 0) {
        for (let i = 0; i < settingsItems.length; i++) {
            settingsItems[i].addEventListener('click', function() {
                const settingId = this.getAttribute('data-setting');
                
                // Remove active class from all settings items
                for (let j = 0; j < settingsItems.length; j++) {
                    settingsItems[j].classList.remove('active');
                }
                this.classList.add('active');
                
                // Remove active class from all panels
                for (let j = 0; j < settingsPanels.length; j++) {
                    settingsPanels[j].classList.remove('active');
                }
                
                // Add active class to selected panel
                const targetPanel = document.getElementById(settingId + '-settings');
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            });
        }
    }

    // ==================== SEARCH AND FILTER FUNCTIONS ====================
    // Patient Search
    const patientSearch = document.getElementById('patientSearch');
    const patientFilter = document.getElementById('patientFilter');
    const patientGenderFilter = document.getElementById('patientGenderFilter');

    if (patientSearch) {
        patientSearch.addEventListener('input', function() {
            filterPatients();
        });
    }

    if (patientFilter) {
        patientFilter.addEventListener('change', function() {
            filterPatients();
        });
    }

    if (patientGenderFilter) {
        patientGenderFilter.addEventListener('change', function() {
            filterPatients();
        });
    }

    // Appointment Search
    const appointmentSearch = document.getElementById('appointmentSearch');
    const appointmentDateFilter = document.getElementById('appointmentDateFilter');
    const appointmentStatusFilter = document.getElementById('appointmentStatusFilter');

    if (appointmentSearch) {
        appointmentSearch.addEventListener('input', function() {
            filterAppointments();
        });
    }

    if (appointmentDateFilter) {
        appointmentDateFilter.addEventListener('change', function() {
            filterAppointments();
        });
    }

    if (appointmentStatusFilter) {
        appointmentStatusFilter.addEventListener('change', function() {
            filterAppointments();
        });
    }

    // Doctor Search
    const doctorSearch = document.getElementById('doctorSearch');
    const doctorDeptFilter = document.getElementById('doctorDeptFilter');
    const doctorStatusFilter = document.getElementById('doctorStatusFilter');

    if (doctorSearch) {
        doctorSearch.addEventListener('input', function() {
            filterDoctors();
        });
    }

    if (doctorDeptFilter) {
        doctorDeptFilter.addEventListener('change', function() {
            filterDoctors();
        });
    }

    if (doctorStatusFilter) {
        doctorStatusFilter.addEventListener('change', function() {
            filterDoctors();
        });
    }

    // ==================== EXPORT FUNCTIONALITY ====================
    const exportPatientsBtn = document.getElementById('exportPatientsBtn');
    if (exportPatientsBtn) {
        exportPatientsBtn.addEventListener('click', function() {
            exportPatients();
        });
    }

    const generateReportBtn = document.getElementById('generateReportBtn');
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', function() {
            generateReport();
        });
    }

    // ==================== LOGOUT ====================
    const adminLogout = document.getElementById('adminLogout');
    if (adminLogout) {
        adminLogout.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('adminAuthenticated');
                localStorage.removeItem('loggedInUser');
                window.location.href = 'admin-login.html';
            }
        });
    }

    // Load all tables initially
    loadAllTables();

    // ==================== DATA LOADING FUNCTIONS ====================
    function loadDashboardStats() {
        // Get all data
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const doctors = JSON.parse(localStorage.getItem('doctors')) || [];
        const pharmacy = JSON.parse(localStorage.getItem('pharmacy')) || [];

        // Calculate stats
        const totalPatients = patients.length;
        const today = new Date().toISOString().split('T')[0];
        const appointmentsToday = appointments.filter(apt => apt.date === today).length;
        const doctorsAvailable = doctors.filter(doc => doc.status === 'available').length;
        const totalMedicines = pharmacy.length;

        // Update UI
        const totalPatientsEl = document.getElementById('totalPatients');
        const appointmentsTodayEl = document.getElementById('appointmentsToday');
        const doctorsAvailableEl = document.getElementById('doctorsAvailable');
        const pharmacyOrdersEl = document.getElementById('pharmacyOrders');
        const revenueTodayEl = document.getElementById('revenueToday');

        if (totalPatientsEl) totalPatientsEl.textContent = totalPatients;
        if (appointmentsTodayEl) appointmentsTodayEl.textContent = appointmentsToday;
        if (doctorsAvailableEl) doctorsAvailableEl.textContent = doctorsAvailable;
        if (pharmacyOrdersEl) pharmacyOrdersEl.textContent = totalMedicines;
        if (revenueTodayEl) {
            // Calculate revenue from completed appointments today
            const todayRevenue = appointments
                .filter(apt => apt.date === today && apt.status === 'completed')
                .length * 150; // Assuming $150 per appointment
            revenueTodayEl.textContent = '$' + todayRevenue.toLocaleString();
        }

        // Load recent patients and appointments
        loadRecentPatients();
        loadRecentAppointments();
    }

    function loadRecentPatients() {
        const tbody = document.getElementById('recentPatientsTable');
        if (!tbody) return;
        
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const recentPatients = patients.slice(0, 5);
        
        if (recentPatients.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No patients found</td></tr>';
            return;
        }
        
        tbody.innerHTML = recentPatients.map(patient => `
            <tr>
                <td>${patient.id}</td>
                <td>${patient.name}</td>
                <td>${patient.age || 'N/A'}</td>
                <td>${patient.gender || 'N/A'}</td>
                <td>${patient.phone || 'N/A'}</td>
                <td>${patient.lastVisit || 'Never'}</td>
                <td><span class="admin-status-badge ${patient.status}">${patient.status}</span></td>
            </tr>
        `).join('');
    }

    function loadRecentAppointments() {
        const tbody = document.getElementById('recentAppointmentsTable');
        if (!tbody) return;
        
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const today = new Date().toISOString().split('T')[0];
        const todayAppointments = appointments
            .filter(apt => apt.date === today)
            .slice(0, 5);
        
        if (todayAppointments.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No appointments today</td></tr>';
            return;
        }
        
        tbody.innerHTML = todayAppointments.map(apt => `
            <tr>
                <td>${apt.patientName}</td>
                <td>${apt.doctorName}</td>
                <td>${apt.time}</td>
                <td><span class="admin-status-badge ${apt.status}">${apt.status}</span></td>
                <td>
                    <button class="admin-action-btn approve" onclick="updateAppointmentStatus('${apt.id}', 'confirmed')"><i class="fas fa-check"></i></button>
                    <button class="admin-action-btn cancel" onclick="updateAppointmentStatus('${apt.id}', 'cancelled')"><i class="fas fa-times"></i></button>
                </td>
            </tr>
        `).join('');
    }

    function loadPatientsTable() {
        const tbody = document.getElementById('patientsTable');
        if (!tbody) return;
        
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        
        if (patients.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" style="text-align: center;">No patients found</td></tr>';
            return;
        }
        
        tbody.innerHTML = patients.map(patient => `
            <tr>
                <td>${patient.id}</td>
                <td>${patient.name}</td>
                <td>${patient.age || 'N/A'}</td>
                <td>${patient.gender || 'N/A'}</td>
                <td>${patient.phone || 'N/A'}</td>
                <td>${patient.email || 'N/A'}</td>
                <td>${patient.lastVisit || 'Never'}</td>
                <td><span class="admin-status-badge ${patient.status}">${patient.status}</span></td>
                <td>
                    <button class="admin-action-btn view" onclick="viewPatient('${patient.id}')"><i class="fas fa-eye"></i></button>
                    <button class="admin-action-btn edit" onclick="editPatient('${patient.id}')"><i class="fas fa-edit"></i></button>
                    <button class="admin-action-btn delete" onclick="deletePatient('${patient.id}')"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    }

    function loadAppointmentsTable() {
        const tbody = document.getElementById('appointmentsTable');
        if (!tbody) return;
        
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        
        if (appointments.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No appointments found</td></tr>';
            return;
        }
        
        tbody.innerHTML = appointments.map(apt => `
            <tr>
                <td>${apt.patientName}</td>
                <td>${apt.doctorName}</td>
                <td>${apt.department}</td>
                <td>${apt.date}</td>
                <td>${apt.time}</td>
                <td><span class="admin-status-badge ${apt.status}">${apt.status}</span></td>
                <td>
                    <button class="admin-action-btn approve" onclick="updateAppointmentStatus('${apt.id}', 'confirmed')"><i class="fas fa-check"></i></button>
                    <button class="admin-action-btn cancel" onclick="updateAppointmentStatus('${apt.id}', 'cancelled')"><i class="fas fa-times"></i></button>
                    <button class="admin-action-btn edit" onclick="rescheduleAppointment('${apt.id}')"><i class="fas fa-calendar-alt"></i></button>
                </td>
            </tr>
        `).join('');
    }

    function loadDoctorsGrid() {
        const grid = document.getElementById('doctorsGrid');
        if (!grid) return;
        
        const doctors = JSON.parse(localStorage.getItem('doctors')) || [];
        
        if (doctors.length === 0) {
            grid.innerHTML = '<p style="text-align: center; color: #666; grid-column: 1/-1;">No doctors found</p>';
            return;
        }
        
        grid.innerHTML = doctors.map(doc => `
            <div class="admin-doctor-card">
                <div class="admin-doctor-avatar">
                    <i class="fas fa-user-md"></i>
                </div>
                <div class="admin-doctor-info">
                    <h3>${doc.name}</h3>
                    <p class="admin-doctor-specialty">${doc.specialty}</p>
                    <p class="admin-doctor-dept">${doc.department}</p>
                    <span class="admin-doctor-status ${doc.status}">${doc.status}</span>
                    <p><small>Patients: ${doc.patients || 0}</small></p>
                </div>
                <div class="admin-doctor-actions">
                    <button class="admin-action-btn edit" onclick="editDoctor('${doc.id}')"><i class="fas fa-edit"></i> Edit</button>
                    <button class="admin-action-btn delete" onclick="deleteDoctor('${doc.id}')"><i class="fas fa-trash"></i> Remove</button>
                </div>
            </div>
        `).join('');
    }

    function loadPharmacyTable() {
        const tbody = document.getElementById('pharmacyTable');
        if (!tbody) return;
        
        const pharmacy = JSON.parse(localStorage.getItem('pharmacy')) || [];
        
        if (pharmacy.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No medicines found</td></tr>';
            return;
        }
        
        tbody.innerHTML = pharmacy.map(med => `
            <tr>
                <td>${med.name}</td>
                <td>${med.category}</td>
                <td>${med.stock}</td>
                <td>$${med.price}</td>
                <td>${med.expiry}</td>
                <td>${med.manufacturer}</td>
                <td>
                    <button class="admin-action-btn edit" onclick="editMedicine('${med.id}')"><i class="fas fa-edit"></i></button>
                    <button class="admin-action-btn delete" onclick="deleteMedicine('${med.id}')"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    }

    function loadLaboratoryTable() {
        const tbody = document.getElementById('laboratoryTable');
        if (!tbody) return;
        
        const labTests = JSON.parse(localStorage.getItem('laboratory')) || [];
        
        if (labTests.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No lab tests found</td></tr>';
            return;
        }
        
        tbody.innerHTML = labTests.map(test => `
            <tr>
                <td>${test.id}</td>
                <td>${test.testName}</td>
                <td>${test.patientName}</td>
                <td>${test.doctorName}</td>
                <td>${test.date}</td>
                <td><span class="admin-status-badge ${test.status}">${test.status}</span></td>
                <td>${test.result}</td>
                <td>
                    ${test.status !== 'completed' ? 
                        `<button class="admin-action-btn edit" onclick="uploadResult('${test.id}')"><i class="fas fa-upload"></i> Upload</button>` : 
                        `<button class="admin-action-btn view" onclick="viewResult('${test.id}')"><i class="fas fa-eye"></i> View</button>`}
                </td>
            </tr>
        `).join('');
    }

    function loadStaffGrid() {
        const grid = document.getElementById('staffGrid');
        if (!grid) return;
        
        const staff = JSON.parse(localStorage.getItem('staff')) || [];
        
        if (staff.length === 0) {
            grid.innerHTML = '<p style="text-align: center; color: #666; grid-column: 1/-1;">No staff members found</p>';
            return;
        }
        
        grid.innerHTML = staff.map(member => `
            <div class="admin-staff-card">
                <div class="admin-staff-avatar">
                    <i class="fas fa-user-tie"></i>
                </div>
                <div class="admin-staff-details">
                    <h3>${member.name}</h3>
                    <p class="admin-staff-role">${member.role}</p>
                    <p class="admin-staff-dept">${member.department}</p>
                    <p class="admin-staff-contact"><i class="fas fa-phone"></i> ${member.phone}</p>
                    <p class="admin-staff-contact"><i class="fas fa-envelope"></i> ${member.email}</p>
                    <span class="admin-staff-status ${member.status}">${member.status}</span>
                </div>
                <div class="admin-staff-actions">
                    <button class="admin-action-btn edit" onclick="editStaff('${member.id}')"><i class="fas fa-edit"></i></button>
                    <button class="admin-action-btn delete" onclick="deleteStaff('${member.id}')"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');
    }

    function loadAdminTabData(tabId) {
        switch(tabId) {
            case 'patients':
                loadPatientsTable();
                break;
            case 'appointments':
                loadAppointmentsTable();
                break;
            case 'doctors':
                loadDoctorsGrid();
                break;
            case 'pharmacy':
                loadPharmacyTable();
                break;
            case 'laboratory':
                loadLaboratoryTable();
                break;
            case 'staff':
                loadStaffGrid();
                break;
        }
    }

    function loadAllTables() {
        loadDashboardStats();
        loadPatientsTable();
        loadAppointmentsTable();
        loadDoctorsGrid();
        loadPharmacyTable();
        loadLaboratoryTable();
        loadStaffGrid();
    }

    // ==================== FILTER FUNCTIONS ====================
    function filterPatients() {
        const searchInput = patientSearch ? patientSearch.value.toLowerCase() : '';
        const statusValue = patientFilter ? patientFilter.value : 'all';
        const genderValue = patientGenderFilter ? patientGenderFilter.value : 'all';
        
        const rows = document.querySelectorAll('#patientsTable tr');
        
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const text = row.textContent.toLowerCase();
            
            let rowStatus = '';
            const statusBadge = row.querySelector('.admin-status-badge');
            if (statusBadge) {
                rowStatus = statusBadge.textContent.toLowerCase();
            }
            
            let rowGender = '';
            const genderCell = row.cells[3];
            if (genderCell) {
                rowGender = genderCell.textContent.toLowerCase();
            }
            
            const matchesSearch = searchInput === '' || text.includes(searchInput);
            const matchesStatus = statusValue === 'all' || rowStatus === statusValue;
            const matchesGender = genderValue === 'all' || rowGender === genderValue;
            
            row.style.display = (matchesSearch && matchesStatus && matchesGender) ? '' : 'none';
        }
    }

    function filterAppointments() {
        const searchInput = appointmentSearch ? appointmentSearch.value.toLowerCase() : '';
        const dateFilter = appointmentDateFilter ? appointmentDateFilter.value : 'all';
        const statusValue = appointmentStatusFilter ? appointmentStatusFilter.value : 'all';
        
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        
        const rows = document.querySelectorAll('#appointmentsTable tr');
        
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const text = row.textContent.toLowerCase();
            
            let rowStatus = '';
            const statusBadge = row.querySelector('.admin-status-badge');
            if (statusBadge) {
                rowStatus = statusBadge.textContent.toLowerCase();
            }
            
            let rowDate = '';
            const dateCell = row.cells[3];
            if (dateCell) {
                rowDate = dateCell.textContent;
            }
            
            let matchesDate = true;
            if (dateFilter === 'today') {
                matchesDate = (rowDate === today);
            } else if (dateFilter === 'tomorrow') {
                matchesDate = (rowDate === tomorrowStr);
            } else if (dateFilter === 'week') {
                const rowDateObj = new Date(rowDate);
                const todayObj = new Date();
                const weekLater = new Date();
                weekLater.setDate(weekLater.getDate() + 7);
                matchesDate = rowDateObj >= todayObj && rowDateObj <= weekLater;
            }
            
            const matchesSearch = searchInput === '' || text.includes(searchInput);
            const matchesStatus = statusValue === 'all' || rowStatus === statusValue;
            
            row.style.display = (matchesSearch && matchesDate && matchesStatus) ? '' : 'none';
        }
    }

    function filterDoctors() {
        const searchInput = doctorSearch ? doctorSearch.value.toLowerCase() : '';
        const deptValue = doctorDeptFilter ? doctorDeptFilter.value : 'all';
        const statusValue = doctorStatusFilter ? doctorStatusFilter.value : 'all';
        
        const cards = document.querySelectorAll('.admin-doctor-card');
        
        cards.forEach(card => {
            const name = card.querySelector('h3')?.textContent.toLowerCase() || '';
            const specialty = card.querySelector('.admin-doctor-specialty')?.textContent.toLowerCase() || '';
            const dept = card.querySelector('.admin-doctor-dept')?.textContent.toLowerCase() || '';
            const status = card.querySelector('.admin-doctor-status')?.textContent.toLowerCase() || '';
            
            const matchesSearch = searchInput === '' || name.includes(searchInput) || specialty.includes(searchInput);
            const matchesDept = deptValue === 'all' || dept === deptValue;
            const matchesStatus = statusValue === 'all' || status === statusValue;
            
            card.style.display = (matchesSearch && matchesDept && matchesStatus) ? '' : 'none';
        });
    }

    // ==================== SAVE FUNCTIONS ====================
    function saveNewPatient() {
        // Get form values
        const firstName = document.querySelector('#addPatientForm input[placeholder*="First Name"]')?.value;
        const lastName = document.querySelector('#addPatientForm input[placeholder*="Last Name"]')?.value;
        const email = document.querySelector('#addPatientForm input[type="email"]')?.value;
        const phone = document.querySelector('#addPatientForm input[type="tel"]')?.value;
        const dob = document.querySelector('#addPatientForm input[type="date"]')?.value;
        const gender = document.querySelector('#addPatientForm select')?.value;
        const address = document.querySelector('#addPatientForm textarea')?.value;
        const emergencyContact = document.querySelector('#addPatientForm input[placeholder*="Emergency"]')?.value;

        // Validate
        if (!firstName || !lastName || !email || !phone) {
            alert('Please fill in all required fields');
            return;
        }

        // Create new patient
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const newPatient = {
            id: 'P' + Date.now().toString().slice(-6),
            name: firstName + ' ' + lastName,
            email: email,
            phone: phone,
            dob: dob || '',
            gender: gender || 'Not Specified',
            address: address || '',
            emergencyContact: emergencyContact || '',
            registeredDate: new Date().toISOString().split('T')[0],
            lastVisit: 'Never',
            status: 'active',
            age: dob ? calculateAge(dob) : '',
            password: 'patient123' // Default password
        };

        patients.push(newPatient);
        localStorage.setItem('patients', JSON.stringify(patients));

        alert('Patient added successfully!');
        
        const modal = document.getElementById('addPatientModal');
        if (modal) {
            modal.classList.remove('show');
        }
        
        // Refresh tables
        loadPatientsTable();
        loadDashboardStats();
    }

    function saveNewDoctor() {
        // Get form values
        const firstName = document.querySelector('#addDoctorForm input[placeholder*="First Name"]')?.value;
        const lastName = document.querySelector('#addDoctorForm input[placeholder*="Last Name"]')?.value;
        const specialization = document.querySelector('#addDoctorForm select')?.value;
        const department = document.querySelectorAll('#addDoctorForm select')[1]?.value;
        const email = document.querySelector('#addDoctorForm input[type="email"]')?.value;
        const phone = document.querySelector('#addDoctorForm input[type="tel"]')?.value;
        const qualification = document.querySelector('#addDoctorForm input[placeholder*="Qualification"]')?.value;
        const experience = document.querySelector('#addDoctorForm input[type="number"]')?.value;

        // Validate
        if (!firstName || !lastName || !specialization || !department || !email || !phone) {
            alert('Please fill in all required fields');
            return;
        }

        // Get selected availability days
        const availabilityCheckboxes = document.querySelectorAll('#addDoctorForm .admin-availability input:checked');
        const availabilityDays = Array.from(availabilityCheckboxes).map(cb => cb.value).join(', ');

        // Create new doctor
        const doctors = JSON.parse(localStorage.getItem('doctors')) || [];
        const newDoctor = {
            id: 'D' + Date.now().toString().slice(-6),
            name: 'Dr. ' + firstName + ' ' + lastName,
            specialty: specialization,
            department: department,
            email: email,
            phone: phone,
            qualification: qualification || '',
            experience: parseInt(experience) || 0,
            availability: availabilityDays || 'Mon-Fri',
            status: 'available',
            patients: 0,
            fee: 150 // Default fee
        };

        doctors.push(newDoctor);
        localStorage.setItem('doctors', JSON.stringify(doctors));

        alert('Doctor added successfully!');
        
        const modal = document.getElementById('addDoctorModal');
        if (modal) {
            modal.classList.remove('show');
        }
        
        // Refresh doctors grid
        loadDoctorsGrid();
        loadDashboardStats();
    }

    function saveNewMedicine() {
        // Get form values
        const name = document.querySelector('#addMedicineForm input[placeholder*="Medicine Name"]')?.value;
        const category = document.querySelector('#addMedicineForm select')?.value;
        const stock = document.querySelector('#addMedicineForm input[type="number"]')?.value;
        const price = document.querySelectorAll('#addMedicineForm input[type="number"]')[1]?.value;
        const expiry = document.querySelector('#addMedicineForm input[type="date"]')?.value;
        const manufacturer = document.querySelector('#addMedicineForm input[placeholder*="Manufacturer"]')?.value;

        // Validate
        if (!name || !category || !stock || !price || !expiry) {
            alert('Please fill in all required fields');
            return;
        }

        // Create new medicine
        const pharmacy = JSON.parse(localStorage.getItem('pharmacy')) || [];
        const newMedicine = {
            id: 'M' + Date.now().toString().slice(-6),
            name: name,
            category: category,
            stock: parseInt(stock),
            price: parseFloat(price),
            expiry: expiry,
            manufacturer: manufacturer || 'Unknown'
        };

        pharmacy.push(newMedicine);
        localStorage.setItem('pharmacy', JSON.stringify(pharmacy));

        alert('Medicine added to inventory!');
        
        const modal = document.getElementById('addMedicineModal');
        if (modal) {
            modal.classList.remove('show');
        }
        
        // Refresh pharmacy table
        loadPharmacyTable();
    }

    function saveNewStaff() {
        // Get form values
        const name = document.querySelector('#addStaffForm input[placeholder*="Full Name"]')?.value;
        const role = document.querySelector('#addStaffForm select')?.value;
        const department = document.querySelectorAll('#addStaffForm select')[1]?.value;
        const status = document.querySelectorAll('#addStaffForm select')[2]?.value;
        const email = document.querySelector('#addStaffForm input[type="email"]')?.value;
        const phone = document.querySelector('#addStaffForm input[type="tel"]')?.value;
        const address = document.querySelector('#addStaffForm textarea')?.value;

        // Validate
        if (!name || !role || !department || !status || !email || !phone) {
            alert('Please fill in all required fields');
            return;
        }

        // Create new staff
        const staff = JSON.parse(localStorage.getItem('staff')) || [];
        const newStaff = {
            id: 'S' + Date.now().toString().slice(-6),
            name: name,
            role: role,
            department: department,
            email: email,
            phone: phone,
            address: address || '',
            status: status.toLowerCase(),
            joinedDate: new Date().toISOString().split('T')[0]
        };

        staff.push(newStaff);
        localStorage.setItem('staff', JSON.stringify(staff));

        alert('Staff member added successfully!');
        
        const modal = document.getElementById('addStaffModal');
        if (modal) {
            modal.classList.remove('show');
        }
        
        // Refresh staff grid
        loadStaffGrid();
    }

    function saveGeneralSettings() {
        // Get form values
        const clinicName = document.querySelector('#generalSettingsForm input[type="text"]')?.value;
        const contactEmail = document.querySelector('#generalSettingsForm input[type="email"]')?.value;
        const contactPhone = document.querySelector('#generalSettingsForm input[type="tel"]')?.value;
        const address = document.querySelector('#generalSettingsForm textarea')?.value;

        // Save to localStorage
        const settings = {
            clinicName: clinicName || 'City General Hospital',
            contactEmail: contactEmail || 'admin@cityhospital.com',
            contactPhone: contactPhone || '+1 (555) 123-4567',
            address: address || '123 Healthcare Ave, Medical District, NY 10001'
        };

        localStorage.setItem('clinicSettings', JSON.stringify(settings));
        alert('Settings saved successfully!');
    }

    function saveWorkingHours() {
        // This would save working hours settings
        alert('Working hours updated successfully!');
    }

    // ==================== EXPORT FUNCTIONS ====================
    function exportPatients() {
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        
        // Create CSV content
        let csv = 'ID,Name,Age,Gender,Phone,Email,Last Visit,Status\n';
        patients.forEach(p => {
            csv += `${p.id},${p.name},${p.age || ''},${p.gender || ''},${p.phone || ''},${p.email || ''},${p.lastVisit || ''},${p.status}\n`;
        });
        
        // Download CSV
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'patients_export.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    }

    function generateReport() {
        alert('Generating PDF report... (PDF generation would be implemented with a library)');
    }

    // ==================== RESET FORM FUNCTIONS ====================
    function resetPatientForm() {
        const form = document.getElementById('addPatientForm');
        if (form) form.reset();
    }

    function resetDoctorForm() {
        const form = document.getElementById('addDoctorForm');
        if (form) form.reset();
    }

    function resetMedicineForm() {
        const form = document.getElementById('addMedicineForm');
        if (form) form.reset();
    }

    function resetStaffForm() {
        const form = document.getElementById('addStaffForm');
        if (form) form.reset();
    }

    // ==================== HELPER FUNCTIONS ====================
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

    // ==================== GLOBAL FUNCTIONS ====================
    window.viewPatient = function(id) {
        alert('Viewing patient ' + id);
    };
    
    window.editPatient = function(id) {
        alert('Editing patient ' + id);
    };
    
    window.deletePatient = function(id) {
        if (confirm('Delete patient ' + id + '?')) {
            const patients = JSON.parse(localStorage.getItem('patients')) || [];
            const filtered = patients.filter(p => p.id !== id);
            localStorage.setItem('patients', JSON.stringify(filtered));
            loadPatientsTable();
            loadDashboardStats();
            alert('Patient deleted');
        }
    };

    window.updateAppointmentStatus = function(id, status) {
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const index = appointments.findIndex(a => a.id === id);
        
        if (index !== -1) {
            appointments[index].status = status;
            localStorage.setItem('appointments', JSON.stringify(appointments));
            
            // Refresh tables
            loadAppointmentsTable();
            loadRecentAppointments();
            loadDashboardStats();
            
            alert(`Appointment ${status}`);
        }
    };
    
    window.rescheduleAppointment = function(id) {
        alert('Rescheduling appointment ' + id);
    };

    window.editDoctor = function(id) {
        alert('Editing doctor ' + id);
    };
    
    window.deleteDoctor = function(id) {
        if (confirm('Remove doctor ' + id + '?')) {
            const doctors = JSON.parse(localStorage.getItem('doctors')) || [];
            const filtered = doctors.filter(d => d.id !== id);
            localStorage.setItem('doctors', JSON.stringify(filtered));
            loadDoctorsGrid();
            loadDashboardStats();
            alert('Doctor removed');
        }
    };

    window.editMedicine = function(id) {
        alert('Editing medicine ' + id);
    };
    
    window.deleteMedicine = function(id) {
        if (confirm('Delete medicine ' + id + '?')) {
            const pharmacy = JSON.parse(localStorage.getItem('pharmacy')) || [];
            const filtered = pharmacy.filter(m => m.id !== id);
            localStorage.setItem('pharmacy', JSON.stringify(filtered));
            loadPharmacyTable();
            alert('Medicine deleted');
        }
    };

    window.uploadResult = function(id) {
        alert('Uploading result for test ' + id);
    };
    
    window.viewResult = function(id) {
        alert('Viewing result for test ' + id);
    };

    window.editStaff = function(id) {
        alert('Editing staff ' + id);
    };
    
    window.deleteStaff = function(id) {
        if (confirm('Delete staff member ' + id + '?')) {
            const staff = JSON.parse(localStorage.getItem('staff')) || [];
            const filtered = staff.filter(s => s.id !== id);
            localStorage.setItem('staff', JSON.stringify(filtered));
            loadStaffGrid();
            alert('Staff member deleted');
        }
    };

    // ==================== KEYBOARD SHORTCUTS ====================
    document.addEventListener('keydown', function(e) {
        // Esc = Close any open modal
        if (e.key === 'Escape') {
            if (addPatientModal) addPatientModal.classList.remove('show');
            if (addDoctorModal) addDoctorModal.classList.remove('show');
            if (addMedicineModal) addMedicineModal.classList.remove('show');
            if (addStaffModal) addStaffModal.classList.remove('show');
            if (deleteConfirmModal) deleteConfirmModal.classList.remove('show');
        }
    });
});