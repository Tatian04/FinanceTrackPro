// app.js

new Vue({
    el: '#app', // Elemento DOM en el que Vue se montará (el div con id="app")
    data: {
        newTransaction: { // Datos iniciales y estado de la aplicación
            type: '', // Tipo de transacción ('income' para ingresos, 'expense' para gastos)
            amount: '',  // Cantidad de transacciones
            description: '' // Descripción de la transacción
        },
        transactions: [],  // Array para almacenar las transacciones registradas
        nextId: 1,  // ID incremental para cada nueva transacción
        chart: null  // Referencia a la instancia de la gráfica
    },
    methods: {  // Métodos que gestionan las acciones de la aplicación
        addTransaction() {  // Método para agregar una nueva transacción
            if (this.newTransaction.amount && this.newTransaction.description) { // Verifica que se hayan ingresado cantidad y descripción
                this.transactions.push({  // Agrega la nueva transacción al array de transacciones
                    id: this.nextId++,  // Asigna un ID único a la transacción y lo incrementa para la siguiente
                    type: this.newTransaction.type,
                    amount: parseFloat(this.newTransaction.amount).toFixed(2), // Convierte la cantidad a un número de punto flotante con dos decimales
                    description: this.newTransaction.description,
                    date: new Date().toLocaleString() // Asigna la fecha y hora actual como la fecha de la transacción
                });
                this.newTransaction = { type: '', amount: '', description: '' }; // Resetea el formulario para la siguiente entrada
                this.updateChart(); // Actualiza la gráfica para reflejar la nueva transacción
            }
        },
        updateChart() {  // Método para actualizar la gráfica de seguimiento
            const ctx = document.getElementById('expenseChart').getContext('2d'); // Obtiene el contexto del canvas para dibujar la gráfica

            const labels = this.transactions.map(t => t.date); // Extrae las fechas de las transacciones como etiquetas de la gráfica
            const incomes = this.transactions
                .filter(t => t.type === 'income')
                .map(t => t.amount); // Filtra las transacciones para obtener las cantidades de ingresos
            const expenses = this.transactions
                .filter(t => t.type === 'expense')
                .map(t => t.amount); // Filtra las transacciones para obtener las cantidades de gastos

            // Destruir la gráfica anterior si ya existe
            if (this.chart) {
                this.chart.destroy();
            }

            // Crea una nueva gráfica de barras con Chart.js
            this.chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Ingresos',
                        data: incomes,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }, {
                        label: 'Gastos',
                        data: expenses,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true // Configura la escala y para que inicie en cero
                        }
                    }
                }
            });
        }
    },
    mounted() {   // Hook de ciclo de vida de Vue que se ejecuta cuando la instancia está montada
        this.updateChart(); // Inicializa la gráfica al cargar la página
    }
});
