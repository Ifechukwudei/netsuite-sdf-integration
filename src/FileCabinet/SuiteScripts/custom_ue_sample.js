/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/log'], (log) => {
    /**
     * Defines the function definition that is executed before record is submitted.
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type; use type cannot be changed
     * @since 2015.2
     */
    const beforeSubmit = (scriptContext) => {
        try {
            log.audit({
                title: 'beforeSubmit Execution',
                details: `Processing record type: ${scriptContext.newRecord.type}, ID: ${scriptContext.newRecord.id || 'New Record'}, Event Type: ${scriptContext.type}`
            });
        } catch (e) {
            log.error({
                title: 'Error in beforeSubmit',
                details: e.toString()
            });
        }
    };

    return {
        beforeSubmit
    };
});
