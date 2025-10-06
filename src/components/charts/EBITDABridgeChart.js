import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const EBITDABridgeChart = ({ transitionData, scenario }) => {
  if (!transitionData || !transitionData.carbonCost) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '12px',
        border: '2px dashed #dee2e6'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
        <h3 style={{ color: '#6c757d' }}>EBITDA Bridge Analizi</h3>
        <p style={{ color: '#adb5bd' }}>Hesaplama tamamlandığında grafik burada görüntülenecek</p>
      </div>
    );
  }

  // PDF sayfa 2-3'teki EBITDA Bridge bileşenleri
  const carbonCost = transitionData.carbonCost || 0;
  const electricityCost = transitionData.electricityCost || 0;
  const demandImpact = transitionData.demandImpact || 0;
  const baseEBITDA = transitionData.baseEBITDA || 0;
  const totalShock = transitionData.totalShock || 0;

  // Waterfall chart data - PDF örneğindeki gibi
  const chartData = {
    labels: ['Baseline EBITDA', 'Karbon Maliyeti', 'Enerji Maliyeti', 'Talep Etkisi', 'Net EBITDA'],
    datasets: [
      {
        label: 'EBITDA Impact (QAR)',
        data: [
          baseEBITDA,
          -carbonCost,
          -electricityCost, 
          -demandImpact,
          baseEBITDA - totalShock
        ],
        backgroundColor: [
          '#22c55e', // Baseline - yeşil
          '#ef4444', // Carbon cost - kırmızı  
          '#f59e0b', // Energy cost - turuncu
          '#8b5cf6', // Demand impact - mor
          '#dc2626'  // Final - koyu kırmızı
        ],
        borderColor: [
          '#16a34a',
          '#dc2626',
          '#d97706',
          '#7c3aed',
          '#b91c1c'
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: `EBITDA Bridge Analizi - ${scenario?.toUpperCase() || 'Senaryo'}`,
        font: {
          size: 18,
          weight: 'bold'
        },
        color: '#1f2937',
        padding: 20
      },
      tooltip: {
        backgroundColor: 'rgba(31, 41, 55, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            const value = Math.abs(context.raw);
            const formattedValue = value.toLocaleString('tr-TR');
            const percentage = ((Math.abs(context.raw) / baseEBITDA) * 100).toFixed(1);
            
            if (context.dataIndex === 0) {
              return `Baseline: ${formattedValue} QAR`;
            } else if (context.dataIndex === 4) {
              return `Net EBITDA: ${formattedValue} QAR`;
            } else {
              return `Etki: -${formattedValue} QAR (${percentage}%)`;
            }
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12,
            weight: '500'
          },
          color: '#4b5563'
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.2)'
        },
        ticks: {
          font: {
            size: 12
          },
          color: '#6b7280',
          callback: function(value) {
            return (value / 1000000).toFixed(1) + 'M QAR';
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  // Scenario details from PDF
  const getScenarioDetails = (scenario) => {
    const scenarios = {
      'orderly_2030': {
        name: '🌱 Düzenli Geçiş',
        description: '1.5°C - Paris uyumlu, zamanında politika',
        carbonPrice: '150 QAR/tCO₂e',
        color: '#22c55e'
      },
      'disorderly_2030': {
        name: '⚠️ Düzensiz Geçiş', 
        description: 'Gecikmeli politika, ani değişiklikler',
        carbonPrice: '300 QAR/tCO₂e',
        color: '#f59e0b'
      },
      'hothouse_2030': {
        name: '🔥 Sera Dünyası',
        description: '3°C+ - Yetersiz politika, fiziksel risk',
        carbonPrice: '50 QAR/tCO₂e', 
        color: '#ef4444'
      }
    };
    return scenarios[scenario] || scenarios['orderly_2030'];
  };

  const scenarioInfo = getScenarioDetails(scenario);

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '25px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      marginBottom: '30px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '25px',
        paddingBottom: '20px',
        borderBottom: '2px solid #f1f5f9'
      }}>
        <div>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '22px', color: '#1e293b' }}>
            📊 EBITDA Bridge Analizi
          </h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
            PDF Metodolojisi - Step B: İklim şoklarının finansal etkisi
          </p>
        </div>
        <div style={{
          backgroundColor: scenarioInfo.color + '20',
          padding: '12px 20px',
          borderRadius: '25px',
          border: `2px solid ${scenarioInfo.color}40`
        }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: scenarioInfo.color }}>
            {scenarioInfo.name}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            {scenarioInfo.carbonPrice}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: '400px', marginBottom: '25px' }}>
        <Bar data={chartData} options={options} />
      </div>

      {/* Breakdown Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '15px',
        marginBottom: '20px'
      }}>
        <div style={{
          padding: '16px',
          backgroundColor: '#fef3c7',
          borderRadius: '10px',
          borderLeft: '4px solid #f59e0b',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: '#92400e', marginBottom: '6px' }}>
            Karbon Maliyeti
          </div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#d97706' }}>
            {carbonCost.toLocaleString('tr-TR')} QAR
          </div>
          <div style={{ fontSize: '11px', color: '#a16207', marginTop: '4px' }}>
            Scope 1 × {transitionData.details?.carbonPrice || 0} QAR/tCO₂e
          </div>
        </div>

        <div style={{
          padding: '16px',
          backgroundColor: '#fee2e2',
          borderRadius: '10px',
          borderLeft: '4px solid #ef4444',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: '#991b1b', marginBottom: '6px' }}>
            Enerji Maliyeti
          </div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#dc2626' }}>
            {electricityCost.toLocaleString('tr-TR')} QAR
          </div>
          <div style={{ fontSize: '11px', color: '#b91c1c', marginTop: '4px' }}>
            MWh × {transitionData.details?.energyPriceDelta || 0} QAR/MWh
          </div>
        </div>

        <div style={{
          padding: '16px',
          backgroundColor: '#f3e8ff',
          borderRadius: '10px',
          borderLeft: '4px solid #8b5cf6',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: '#6b21a8', marginBottom: '6px' }}>
            Talep Etkisi
          </div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#7c3aed' }}>
            {demandImpact.toLocaleString('tr-TR')} QAR
          </div>
          <div style={{ fontSize: '11px', color: '#6d28d9', marginTop: '4px' }}>
            Sektör Δ: {transitionData.details?.sectorDelta || 0}%
          </div>
        </div>

        <div style={{
          padding: '16px',
          backgroundColor: '#dcfce7',
          borderRadius: '10px',
          borderLeft: '4px solid #22c55e',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: '#15803d', marginBottom: '6px' }}>
            EBITDA Şoku
          </div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#16a34a' }}>
            {transitionData.shockPercentage?.toFixed(1) || 0}%
          </div>
          <div style={{ fontSize: '11px', color: '#166534', marginTop: '4px' }}>
            TRS: {transitionData.trs || '0.00'}
          </div>
        </div>
      </div>

      {/* PDF Reference */}
      <div style={{
        backgroundColor: '#f8fafc',
        padding: '12px 16px',
        borderRadius: '8px',
        borderLeft: '4px solid #3b82f6'
      }}>
        <div style={{ fontSize: '12px', color: '#1e40af', fontWeight: '600' }}>
          📑 PDF Referans: Step B - Compute raw shocks to business fundamentals
        </div>
        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
          "EBITDA_shock = Carbon_Cost + Elec_Cost + Demand_Impact" - Sayfa 2
        </div>
      </div>
    </div>
  );
};

export default EBITDABridgeChart;