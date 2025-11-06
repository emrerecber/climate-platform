# Improved handleFinancialFormSubmit Function

Replace the entire `handleFinancialFormSubmit` function in `App.js` (lines 341-541) with this improved version:

```javascript
const handleFinancialFormSubmit = async (data) => {
  setIsLoading(true);
  setLoadingMessage('Calculating climate risk assessments...');
  
  try {
    // Store form data for later use
    setSubmittedFormData(data);
    
    // PHASE 1: CALCULATIONS
    toast.showInfo('Starting comprehensive climate risk analysis...');
    
    // Financial Analysis calculation
    const analysisResult = financialAnalysis.generateComprehensiveAnalysis(data);
    setFinancialAnalysisData(analysisResult);
    
    // PACTA calculation (if sector data provided)
    if (data.pactaSector && data.pactaSector !== '') {
      const pactaResult = calculatePACTA(data);
      setPactaResults(pactaResult);
    } else {
      setPactaResults(null);
    }
    
    // TCFD calculation (if governance data provided)
    if (data.hasClimateExpertOnBoard !== undefined && data.hasClimateExpertOnBoard !== '') {
      const tcfdResult = calculateTCFD(data);
      setTcfdResults(tcfdResult);
    } else {
      setTcfdResults(null);
    }

    // Scope 3 calculation
    try {
      const s3 = calculateScope3(data);
      setScope3Results(s3);
    } catch (e) {
      console.warn('Scope 3 calculation failed:', e);
      setScope3Results(null);
    }

    // Forward-looking metrics
    try {
      const fwd = calculateForwardMetrics(data);
      setForwardMetrics(fwd);
    } catch (e) {
      console.warn('Forward metrics calculation failed:', e);
      setForwardMetrics(null);
    }

    // Physical risk assessment
    try {
      const phys = assessPhysicalRisk({
        country: data.country || data.entityCountry || data.headquarterCountry,
        city: data.city || data.entityCity,
        sector: data.sector || data.pactaSector,
        totalAssets: analysisResult?.summary?.totalAssets,
        annualRevenue: analysisResult?.summary?.totalIncome
      });
      setPhysicalRisk(phys);
    } catch (e) {
      console.warn('Physical risk calculation failed:', e);
      setPhysicalRisk(null);
    }

    // Peer benchmarking (use available metrics)
    try {
      const bm = performBenchmarkingAnalysis({
        carbonIntensity: data.steelCarbonIntensity || data.cementCarbonIntensity || data.buildingEmissionsIntensity,
        renewableShare: data.renewableEnergyShare || data.renewableTarget2030,
        evProductionShare: data.evProductionTarget2030,
        lowCarbonShare: data.lowCarbonSteelTarget2030,
        clinkerRatio: data.clinkerRatio,
        safUsage: data.safUsage,
        renewableHeatingShare: data.renewableHeatingShare,
        tcfdScore: tcfdResults?.overallScore,
        financed_emissions: undefined,
        greenFinanceShare: undefined
      }, (data.sector || data.pactaSector || 'default'));
      setBenchmarking(bm);
    } catch (e) {
      console.warn('Benchmarking calculation failed:', e);
      setBenchmarking(null);
    }
    
    toast.showSuccess('Climate risk calculations completed!');
    
    // PHASE 2: BACKEND SAVE
    setLoadingMessage('Saving assessment to database...');
    
    const companyData = {
      companyName: data.entityName || data.companyName,
      sector: data.sector || data.pactaSector || 'Other',
      country: data.country || data.entityCountry || data.headquarterCountry || 'Turkey',
      city: data.city || data.entityCity,
      revenue: parseFloat(data.totalIncome) || parseFloat(data.annualRevenue) || null,
      employees: parseInt(data.employeeCount) || null,
      yearFounded: parseInt(data.yearFounded) || null,
      formData: data, // Store complete form data
      status: 'completed',
      completionPercentage: 100,
      lastCalculatedAt: new Date().toISOString()
    };

    let savedCompanyId = null;
    let backendSaveSuccess = false;
    
    try {
      if (initialCompany) {
        // UPDATE EXISTING COMPANY
        const updateResponse = await companyAPI.update(initialCompany.id, companyData);
        console.log('Company updated:', updateResponse);
        savedCompanyId = initialCompany.id;
        
        // Save calculation results
        const calculations = {
          pactaResults,
          tcfdResults,
          financialResults: analysisResult,
          scope3Results,
          forwardMetrics,
          physicalRisk,
          benchmarking
        };
        
        await companyAPI.saveCalculations(initialCompany.id, calculations);
        console.log('Calculations saved');
        
        backendSaveSuccess = true;
        toast.showSuccess('Assessment updated and saved successfully!');
        
        if (onDataSaved) onDataSaved();
        
        // Ask if user wants to submit for review (non-blocking)
        if (user && (user.role === 'analyst' || user.role === 'manager' || user.role === 'admin')) {
          setTimeout(() => {
            const shouldSubmit = window.confirm(
              'Would you like to submit this assessment for Manager review?\n\n' +
              'Click OK to submit for review, or Cancel to keep as draft.'
            );
            
            if (shouldSubmit) {
              companyAPI.submitForReview(initialCompany.id)
                .then(() => {
                  toast.showSuccess('Assessment submitted for review!');
                })
                .catch((submitError) => {
                  console.error('Error submitting for review:', submitError);
                  toast.showError('Could not submit for review: ' + submitError.message);
                });
            }
          }, 500); // Delay to let loading screen close first
        }
        
      } else {
        // CREATE NEW COMPANY
        const createResponse = await companyAPI.create(companyData);
        console.log('Company created:', createResponse);
        savedCompanyId = createResponse.data?.company?.id;
        
        // Save calculation results
        if (createResponse.data?.company?.id) {
          const calculations = {
            pactaResults,
            tcfdResults,
            financialResults: analysisResult,
            scope3Results,
            forwardMetrics,
            physicalRisk,
            benchmarking
          };
          
          await companyAPI.saveCalculations(createResponse.data.company.id, calculations);
          console.log('Calculations saved');
        }
        
        backendSaveSuccess = true;
        toast.showSuccess('New assessment created and saved successfully!');
        
        if (onDataSaved) onDataSaved();
        
        // Ask if user wants to submit for review (non-blocking)
        if (user && savedCompanyId && (user.role === 'analyst' || user.role === 'manager' || user.role === 'admin')) {
          setTimeout(() => {
            const shouldSubmit = window.confirm(
              'Would you like to submit this assessment for Manager review?\n\n' +
              'Click OK to submit for review, or Cancel to keep as draft.'
            );
            
            if (shouldSubmit) {
              companyAPI.submitForReview(savedCompanyId)
                .then(() => {
                  toast.showSuccess('Assessment submitted for review!');
                })
                .catch((submitError) => {
                  console.error('Error submitting for review:', submitError);
                  toast.showError('Could not submit for review: ' + submitError.message);
                });
            }
          }, 500);
        }
      }
      
    } catch (backendError) {
      // Backend save failed - but DON'T block the user
      console.error('Backend save error:', backendError);
      
      // Determine error type for better UX
      if (backendError.name === 'NetworkError') {
        toast.showWarning(
          'Network error - Assessment calculations completed but could not be saved to server. ' +
          'Please check your internet connection and try again.',
          8000 // 8 seconds
        );
      } else if (backendError.name === 'TimeoutError') {
        toast.showWarning(
          'Server timeout - Assessment calculations completed but save took too long. ' +
          'The data may still be saving in the background.',
          8000
        );
      } else if (backendError.status === 401) {
        toast.showError(
          'Authentication error - Please log in again to save your assessment.',
          8000
        );
      } else if (backendError.status === 403) {
        toast.showError(
          'Permission denied - You do not have permission to save assessments.',
          8000
        );
      } else if (backendError.status >= 500) {
        toast.showError(
          'Server error - Assessment calculations completed but server is experiencing issues. ' +
          'Please contact support if this persists.',
          8000
        );
      } else {
        toast.showWarning(
          'Could not save to database: ' + backendError.message + '. ' +
          'However, your calculations are complete and viewable.',
          8000
        );
      }
      
      backendSaveSuccess = false;
    }
    
    // PHASE 3: SHOW RESULTS
    setIsLoading(false);
    setShowFinancialForm(false);
    setShowFinancialReport(true);
    
    // Final success toast with analysis summary
    if (backendSaveSuccess) {
      toast.showSuccess(
        '✅ ECB/IFRS S2 compliant climate risk assessment completed and saved!',
        4000
      );
    } else {
      toast.showInfo(
        'Climate risk assessment completed! You can view results now.',
        4000
      );
    }
    
  } catch (error) {
    // Catastrophic error (calculation failure)
    console.error('Critical error in assessment:', error);
    setIsLoading(false);
    
    toast.showError(
      'Failed to complete climate risk assessment: ' + error.message + '. ' +
      'Please check your form data and try again.',
      10000
    );
    
    // Don't close form, let user fix the issue
  }
};
```

## Key Improvements:

1. **3-Phase Structure**: Calculations → Backend Save → Show Results
2. **Toast Notifications**: 
   - Info: "Starting analysis..."
   - Success: "Calculations completed", "Saved successfully"
   - Warning: Network/timeout errors (non-blocking)
   - Error: Authentication/permission/server errors
3. **Loading States**: 
   - "Calculating..." → "Saving..." → Results
4. **Better Error Handling**:
   - Network errors don't block results
   - Specific error messages per error type
   - Retry logic is handled by improved api.js
5. **Non-blocking Submit for Review**: Uses setTimeout + Promise to not block UI
6. **Graceful Degradation**: Calculations succeed even if backend fails

## Next: Add this function and update render to show LoadingOverlay
