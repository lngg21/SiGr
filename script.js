let dadosCSV;
let grafico;
let serieSelecionada;
let cabecalhos;

const entradaArquivoCSV = document.getElementById('csvFile');
const selecaoSeries = document.getElementById('series');
const selecaoTipoGrafico = document.getElementById('chartType');
const checkboxInicioZero = document.getElementById('beginAtZero');
const checkboxCurvaSuave = document.getElementById('smoothCurve');
const checkboxEmpilhado = document.getElementById('stacked');
const checkboxPreencherArea = document.getElementById('fillArea');
const chartCanvas = document.getElementById('chartCanvas');

entradaArquivoCSV.addEventListener('change', processarSelecaoArquivo);
selecaoSeries.addEventListener('change', function () {
    serieSelecionada = selecaoSeries.value;
    atualizarGrafico();
});
checkboxInicioZero.addEventListener('input', atualizarGrafico);
checkboxCurvaSuave.addEventListener('input', atualizarGrafico);
checkboxEmpilhado.addEventListener('input', atualizarGrafico);
checkboxPreencherArea.addEventListener('input', atualizarGrafico);

function processarSelecaoArquivo(evento) {
    const arquivo = evento.target.files[0];
    Papa.parse(arquivo, {
        complete: function (resultado) {
            dadosCSV = resultado.data;
            cabecalhos = dadosCSV[0];
            popularSelecaoSeries();
            serieSelecionada = cabecalhos[0];
            atualizarGrafico();
            popularPreviaDados();
        }
    });
}

function popularSelecaoSeries() {
    cabecalhos.forEach(cabecalho => {
        const opcao = document.createElement('option');
        opcao.value = cabecalho;
        opcao.textContent = cabecalho;
        selecaoSeries.appendChild(opcao);
    });
}

function atualizarGrafico() {
    if (grafico) {
        grafico.destroy();
    }

    const rotulos = dadosCSV.slice(1).map(linha => linha[0]);
    const dados = dadosCSV.slice(1).map(linha => parseFloat(linha[cabecalhos.indexOf(serieSelecionada)]));

    grafico = new Chart(chartCanvas, {
        type: selecaoTipoGrafico.value,
        data: {
            labels: rotulos,
            datasets: [{
                label: serieSelecionada,
                data: dados,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: checkboxInicioZero.checked
                    }
                }]
            },
            elements: {
                line: {
                    tension: checkboxCurvaSuave.checked ? 0.4 : 0
                }
            },
            tooltips: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                filler: {
                    propagate: checkboxPreencherArea.checked
                },
                stacked: checkboxEmpilhado.checked
            }
        }
    });
}

function popularPreviaDados() {
    const tabela = document.createElement('table');
    const linhaCabecalho = document.createElement('tr');
    cabecalhos.forEach(cabecalho => {
        const th = document.createElement('th');
        th.textContent = cabecalho;
        linhaCabecalho.appendChild(th);
    });
    tabela.appendChild(linhaCabecalho);

    const dadosPrevia = dadosCSV.slice(1, 6);
    dadosPrevia.forEach(linha => {
        const linhaDados = document.createElement('tr');
        linha.forEach(celula => {
            const td = document.createElement('td');
            td.textContent = celula;
            linhaDados.appendChild(td);
        });
        tabela.appendChild(linhaDados);
    });

    const previaDados = document.getElementById('dataPreview');
    previaDados.innerHTML = '';
    previaDados.appendChild(tabela);
}

function exportarGrafico() {
    const imagem = chartCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imagem;
    link.download = 'grafico.png';
    link.click();
}
