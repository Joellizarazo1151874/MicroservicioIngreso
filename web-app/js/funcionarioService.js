// Servicio para gestionar funcionarios
const funcionarioService = {
    // Obtener todos los funcionarios
    getAllFuncionarios: async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('../funcionario-service/index.php?action=funcionarios', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            return await response.json();
        } catch (error) {
            console.error('Error al obtener funcionarios:', error);
            return { status: 'error', message: 'Error al obtener funcionarios' };
        }
    },
    
    // Obtener un funcionario específico por código
    getFuncionarioByCode: async (codigo) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`../funcionario-service/index.php?action=funcionarios&codigo=${codigo}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            return await response.json();
        } catch (error) {
            console.error('Error al obtener funcionario:', error);
            return { status: 'error', message: 'Error al obtener funcionario' };
        }
    },
    
    // Guardar o actualizar la foto de un funcionario
    saveFuncionarioFoto: async (codigo, foto) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('../funcionario-service/index.php?action=funcionarios/foto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ codigo, foto })
            });
            
            return await response.json();
        } catch (error) {
            console.error('Error al guardar foto de funcionario:', error);
            return { status: 'error', message: 'Error al guardar foto de funcionario' };
        }
    }
};
