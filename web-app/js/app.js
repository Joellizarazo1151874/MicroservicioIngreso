// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const loginForm = document.getElementById('loginForm');
    const mainApp = document.getElementById('mainApp');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const currentUser = document.getElementById('currentUser');
    
    // Elementos de navegación
    const navRegistrarEntrada = document.getElementById('navRegistrarEntrada');
    const navEntradasActivas = document.getElementById('navEntradasActivas');
    const navConsultas = document.getElementById('navConsultas');
    
    // Secciones
    const registrarEntradaSection = document.getElementById('registrarEntradaSection');
    const entradasActivasSection = document.getElementById('entradasActivasSection');
    const consultasSection = document.getElementById('consultasSection');
    
    // Formularios
    const searchStudentForm = document.getElementById('searchStudentForm');
    const studentInfo = document.getElementById('studentInfo');
    const entryForm = document.getElementById('entryForm');
    
    // Botones de acción
    const refreshActiveBtn = document.getElementById('refreshActiveBtn');
    const searchDateBtn = document.getElementById('searchDateBtn');
    const searchTermBtn = document.getElementById('searchTermBtn');
    
    // Verificar autenticación al cargar la página
    const checkAuth = async () => {
        if (auth.isAuthenticated()) {
            // Validar token
            const isValid = await auth.validateToken();
            if (isValid) {
                // Mostrar la aplicación principal
                showAuthenticatedUI();
            } else {
                // Mostrar formulario de login
                showLoginForm();
            }
        } else {
            // Mostrar formulario de login
            showLoginForm();
        }
    };
    
    // Mostrar la interfaz autenticada
    const showAuthenticatedUI = () => {
        loginForm.classList.add('d-none');
        mainApp.classList.remove('d-none');
        
        // Mostrar usuario actual
        const user = auth.getUser();
        if (user) {
            currentUser.textContent = user.usuario;
        }
        
        // Cargar datos iniciales
        loadActiveEntries();
    };
    
    // Mostrar formulario de login
    const showLoginForm = () => {
        loginForm.classList.remove('d-none');
        mainApp.classList.add('d-none');
    };
    
    // Mostrar una sección específica
    const showSection = (section) => {
        // Ocultar todas las secciones
        registrarEntradaSection.classList.add('d-none');
        entradasActivasSection.classList.add('d-none');
        consultasSection.classList.add('d-none');
        
        // Desactivar todos los enlaces de navegación
        navRegistrarEntrada.classList.remove('active');
        navEntradasActivas.classList.remove('active');
        navConsultas.classList.remove('active');
        
        // Mostrar la sección solicitada
        section.classList.remove('d-none');
        
        // Activar el enlace correspondiente
        if (section === registrarEntradaSection) {
            navRegistrarEntrada.classList.add('active');
            // Ocultar info de estudiante cuando cambiamos a esta sección
            studentInfo.classList.add('d-none');
            searchStudentForm.reset();
        } else if (section === entradasActivasSection) {
            navEntradasActivas.classList.add('active');
            loadActiveEntries(); // Cargar entradas activas
        } else if (section === consultasSection) {
            navConsultas.classList.add('active');
        }
    };
    
    // Buscar estudiante por código
    const searchStudent = async (code) => {
        try {
            const response = await entryService.findStudentByCode(code);
            
            if (response.status === 'success') {
                // Mostrar información del estudiante
                document.getElementById('studentName').textContent = response.student.nombre;
                document.getElementById('studentEmail').textContent = response.student.correo;
                document.getElementById('studentCodeInfo').textContent = response.student.codigo;
                document.getElementById('studentProgram').textContent = response.student.programa || 'No especificado';
                document.getElementById('studentFaculty').textContent = response.student.facultad || 'No especificado';
                
                // Llenar campos ocultos del formulario
                document.getElementById('nombre').value = response.student.nombre;
                document.getElementById('correo').value = response.student.correo;
                document.getElementById('codigo').value = response.student.codigo;
                document.getElementById('programa').value = response.student.programa || '';
                document.getElementById('facultad').value = response.student.facultad || '';
                
                // Mostrar formulario de registro
                studentInfo.classList.remove('d-none');
                
                return true;
            } else {
                // Mostrar mensaje de error
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'No se encontró el estudiante con ese código'
                });
                
                // Ocultar formulario de registro
                studentInfo.classList.add('d-none');
                
                return false;
            }
        } catch (error) {
            console.error('Error al buscar estudiante:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error de conexión con el servidor'
            });
            
            // Ocultar formulario de registro
            studentInfo.classList.add('d-none');
            
            return false;
        }
    };
    
    // Cargar entradas activas
    const loadActiveEntries = async () => {
        const sede = document.getElementById('sedeFilter').value;
        
        try {
            const response = await entryService.getActiveEntries(sede);
            
            if (response.status === 'success') {
                // Limpiar tabla
                const tableBody = document.getElementById('activeEntriesTable');
                tableBody.innerHTML = '';
                
                // Añadir filas a la tabla
                response.entries.forEach(entry => {
                    const row = document.createElement('tr');
                    
                    // Formatear fecha
                    const entryDate = new Date(entry.entrada);
                    const formattedDate = entryDate.toLocaleString('es-ES');
                    
                    row.innerHTML = `
                        <td>${entry.id}</td>
                        <td>${entry.nombre}</td>
                        <td>${entry.correo}</td>
                        <td>${entry.codigo || ''}</td>
                        <td>${formattedDate}</td>
                        <td>${entry.sede}</td>
                        <td>
                            <button class="btn btn-sm btn-danger exit-btn" data-id="${entry.id}">
                                Registrar Salida
                            </button>
                        </td>
                    `;
                    
                    tableBody.appendChild(row);
                });
                
                // Añadir event listeners para botones de salida
                document.querySelectorAll('.exit-btn').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        const id = e.target.getAttribute('data-id');
                        registerExitHandler(id);
                    });
                });
            } else {
                // Mostrar mensaje de error
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'Error al cargar las entradas activas'
                });
            }
        } catch (error) {
            console.error('Error al cargar entradas activas:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error de conexión con el servidor'
            });
        }
    };
    
    // Manejar registro de salida
    const registerExitHandler = async (id) => {
        // Confirmar acción
        const { isConfirmed } = await Swal.fire({
            icon: 'question',
            title: '¿Registrar salida?',
            text: '¿Está seguro de registrar la salida?',
            showCancelButton: true,
            confirmButtonText: 'Sí, registrar',
            cancelButtonText: 'Cancelar'
        });
        
        if (isConfirmed) {
            try {
                const response = await entryService.registerExit(id);
                
                if (response.status === 'success') {
                    // Mostrar mensaje de éxito
                    Swal.fire({
                        icon: 'success',
                        title: 'Éxito',
                        text: 'Salida registrada exitosamente'
                    });
                    
                    // Recargar entradas activas
                    loadActiveEntries();
                } else {
                    // Mostrar mensaje de error
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.message || 'Error al registrar la salida'
                    });
                }
            } catch (error) {
                console.error('Error al registrar salida:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error de conexión con el servidor'
                });
            }
        }
    };
    
    // Cargar entradas por fecha
    const loadEntriesByDate = async () => {
        const fechaInicio = document.getElementById('fechaInicio').value;
        const fechaFin = document.getElementById('fechaFin').value;
        const sede = document.getElementById('sedeFecha').value;
        
        // Validar fechas
        if (!fechaInicio || !fechaFin) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos Requeridos',
                text: 'Por favor, ingrese fechas de inicio y fin'
            });
            return;
        }
        
        try {
            const response = await entryService.getEntriesByDate(fechaInicio, fechaFin, sede);
            
            if (response.status === 'success') {
                // Mostrar resultados en la tabla
                renderConsultasTable(response.entries);
            } else {
                // Mostrar mensaje de error
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'Error al cargar las entradas'
                });
            }
        } catch (error) {
            console.error('Error al cargar entradas por fecha:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error de conexión con el servidor'
            });
        }
    };
    
    // Buscar entradas
    const searchEntries = async () => {
        const term = document.getElementById('searchTerm').value;
        
        // Validar término de búsqueda
        if (!term) {
            Swal.fire({
                icon: 'warning',
                title: 'Campo Requerido',
                text: 'Por favor, ingrese un término de búsqueda'
            });
            return;
        }
        
        try {
            const response = await entryService.searchEntry(term);
            
            if (response.status === 'success') {
                // Mostrar resultados en la tabla
                renderConsultasTable(response.entries);
            } else {
                // Mostrar mensaje de error
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'Error al buscar las entradas'
                });
            }
        } catch (error) {
            console.error('Error al buscar entradas:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error de conexión con el servidor'
            });
        }
    };
    
    // Renderizar tabla de consultas
    const renderConsultasTable = (entries) => {
        // Limpiar tabla
        const tableBody = document.getElementById('consultasTable');
        tableBody.innerHTML = '';
        
        // Verificar si hay resultados
        if (entries.length === 0) {
            Swal.fire({
                icon: 'info',
                title: 'Sin Resultados',
                text: 'No se encontraron registros con los criterios especificados'
            });
            return;
        }
        
        // Añadir filas a la tabla
        entries.forEach(entry => {
            const row = document.createElement('tr');
            
            // Formatear fechas
            const entryDate = new Date(entry.entrada);
            const formattedEntryDate = entryDate.toLocaleString('es-ES');
            
            let formattedExitDate = '';
            if (entry.salida) {
                const exitDate = new Date(entry.salida);
                formattedExitDate = exitDate.toLocaleString('es-ES');
            }
            
            row.innerHTML = `
                <td>${entry.id}</td>
                <td>${entry.nombre}</td>
                <td>${entry.correo}</td>
                <td>${entry.codigo || ''}</td>
                <td>${formattedEntryDate}</td>
                <td>${formattedExitDate}</td>
                <td>${entry.sede}</td>
            `;
            
            tableBody.appendChild(row);
        });
    };
    
    // Event Listeners
    
    // Login
    loginBtn.addEventListener('click', async () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Validar campos
        if (!username || !password) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos Requeridos',
                text: 'Usuario y contraseña son requeridos'
            });
            return;
        }
        
        // Intentar login
        const result = await auth.login(username, password);
        
        if (result.success) {
            // Mostrar la aplicación principal
            showAuthenticatedUI();
        } else {
            // Mostrar mensaje de error
            Swal.fire({
                icon: 'error',
                title: 'Error de Autenticación',
                text: result.message || 'Credenciales inválidas'
            });
        }
    });
    
    // Logout
    logoutBtn.addEventListener('click', async () => {
        await auth.logout();
        showLoginForm();
    });
    
    // Navegación
    navRegistrarEntrada.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(registrarEntradaSection);
    });
    
    navEntradasActivas.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(entradasActivasSection);
    });
    
    navConsultas.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(consultasSection);
    });
    
    // Buscar estudiante
    searchStudentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const code = document.getElementById('studentCode').value;
        
        if (!code) {
            Swal.fire({
                icon: 'warning',
                title: 'Campo Requerido',
                text: 'Por favor, ingrese el código del estudiante'
            });
            return;
        }
        
        await searchStudent(code);
    });
    
    // Registro de entrada
    entryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const sede = document.getElementById('sede').value;
        if (!sede) {
            Swal.fire({
                icon: 'warning',
                title: 'Campo Requerido',
                text: 'Por favor, seleccione una sede'
            });
            return;
        }
        
        // Obtener datos del formulario
        const entryData = {
            nombre: document.getElementById('nombre').value,
            correo: document.getElementById('correo').value,
            codigo: document.getElementById('codigo').value,
            programa: document.getElementById('programa').value,
            facultad: document.getElementById('facultad').value,
            sede: sede
        };
        
        try {
            const response = await entryService.registerEntry(entryData);
            
            if (response.status === 'success') {
                // Mostrar mensaje de éxito
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Entrada registrada exitosamente'
                });
                
                // Limpiar formularios
                entryForm.reset();
                searchStudentForm.reset();
                studentInfo.classList.add('d-none');
            } else {
                // Mostrar mensaje de error
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'Error al registrar la entrada'
                });
            }
        } catch (error) {
            console.error('Error al registrar entrada:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error de conexión con el servidor'
            });
        }
    });
    
    // Botón de actualizar entradas activas
    refreshActiveBtn.addEventListener('click', loadActiveEntries);
    
    // Botón de búsqueda por fecha
    searchDateBtn.addEventListener('click', loadEntriesByDate);
    
    // Botón de búsqueda por término
    searchTermBtn.addEventListener('click', searchEntries);
    
    // Iniciar la aplicación
    checkAuth();
}); 