(function () {
  const PROJECT_STATUSES = ['draft', 'planned', 'active', 'completed', 'failed', 'rescheduled', 'follow_up_required', 'verified', 'archived'];
  const BENEFICIARY_TYPES = ['person', 'household', 'group', 'school', 'institution', 'community', 'organisation'];
  const USER_ROLES = ['admin', 'staff', 'viewer', 'project_officer'];
  const USER_STATUSES = ['active', 'inactive'];
  const ENTRY_STATUSES = ['new', 'reviewed', 'rejected', 'duplicate', 'converted', 'needs_manual_review'];
  const RECORD_TYPES = ['project', 'beneficiary', 'location', 'activity'];
  const FIELD_TYPES = ['text', 'number', 'date', 'textarea', 'select', 'boolean'];
  const PHOTO_CATEGORIES = ['before', 'during', 'after', 'follow_up', 'training', 'installation', 'verification', 'map_capture', 'general_evidence'];
  const MAP_SOURCE_TYPES = ['uploaded_image', 'google_static_api', 'google_embed_snippet', 'reference_only'];
  const MAP_PROVIDERS = ['local', 'google', 'custom'];
  const MAP_STATUSES = ['active', 'draft', 'verified', 'archived'];
  const ACTIVITY_TYPES = [
    'tree_planting',
    'seedling_distribution',
    'cookstove_installation',
    'biogas_installation',
    'fish_stocking',
    'fish_harvest',
    'community_training',
    'water_project_work',
    'environmental_restoration',
    'follow_up_visit',
    'verification_visit',
    'general_activity'
  ];
  const ACTIVITY_STATUSES = ['planned', 'scheduled', 'in_progress', 'completed', 'failed', 'rescheduled'];
  const DUTY_STATUSES = ['planned', 'assigned', 'in_progress', 'completed', 'failed', 'rescheduled', 'cancelled'];
  const DUTY_PRIORITIES = ['low', 'normal', 'high', 'critical'];
  const TIMELINE_TYPES = [
    'project_created',
    'beneficiary_added',
    'location_added',
    'document_uploaded',
    'excel_imported',
    'excel_row_converted',
    'photo_uploaded',
    'activity_recorded',
    'follow_up_visit',
    'verification',
    'duty_assigned',
    'duty_completed',
    'map_recorded',
    'status_change',
    'report_generated',
    'note_added'
  ];
  const REPORT_TYPES = [
    'all_projects',
    'single_project',
    'all_beneficiaries',
    'single_beneficiary',
    'all_locations',
    'single_location',
    'excel_import',
    'extracted_data',
    'activity',
    'impact_summary'
  ];
  const REPEATABLE_UPLOAD_FIELDS = [
    { formId: 'projectForm', fieldName: 'profilePhotoFile', allowMultiplePerInput: false },
    { formId: 'projectForm', fieldName: 'referenceDocumentFile', allowMultiplePerInput: false },
    { formId: 'projectForm', fieldName: 'evidenceImageFile', allowMultiplePerInput: false },
    { formId: 'beneficiaryForm', fieldName: 'profilePhotoFile', allowMultiplePerInput: false },
    { formId: 'beneficiaryForm', fieldName: 'referenceDocumentFile', allowMultiplePerInput: false },
    { formId: 'beneficiaryForm', fieldName: 'evidenceImageFile', allowMultiplePerInput: false },
    { formId: 'locationForm', fieldName: 'profilePhotoFile', allowMultiplePerInput: false },
    { formId: 'locationForm', fieldName: 'referenceDocumentFile', allowMultiplePerInput: false },
    { formId: 'locationForm', fieldName: 'evidenceImageFile', allowMultiplePerInput: false },
    { formId: 'activityForm', fieldName: 'profilePhotoFile', allowMultiplePerInput: false },
    { formId: 'activityForm', fieldName: 'referenceDocumentFile', allowMultiplePerInput: false },
    { formId: 'activityForm', fieldName: 'evidenceImageFile', allowMultiplePerInput: false },
    { formId: 'documentForm', fieldName: 'filePath', allowMultiplePerInput: false },
    { formId: 'photoForm', fieldName: 'filePath', allowMultiplePerInput: true, syncQueue: true }
  ];
  const CALENDAR_EVENT_TYPES = [
    { value: 'item_distribution', label: 'Item distribution' },
    { value: 'project_planned', label: 'Project planned' },
    { value: 'project_launch', label: 'Project launched' },
    { value: 'project_completion', label: 'Project completed' },
    { value: 'beneficiary_enrolled', label: 'Beneficiary enrolled' },
    { value: 'activity_conducted', label: 'Activity conducted' },
    { value: 'duty_assignment', label: 'Duty assignment' },
    { value: 'map_recorded', label: 'Map recorded' },
    { value: 'timeline_event', label: 'Timeline event' }
  ];
  const TABLE_PAGE_SIZE = 10;
  const PROJECT_CATEGORY_PROFILES = {
    'Tree Planting': {
      summary: 'Capture the biological and follow-up story clearly: what species were planted, where, when, and what survival lessons were learned.',
      fields: [
        { key: 'treeSpecies', label: 'Tree species', type: 'text' },
        { key: 'numberPlanted', label: 'Number planted', type: 'number' },
        { key: 'plantingDate', label: 'Planting date', type: 'date' },
        { key: 'institutionName', label: 'Institution or community name', type: 'text' },
        { key: 'followUpVisitNotes', label: 'Follow-up visit notes', type: 'textarea' }
      ]
    },
    'Seedling Distribution': {
      summary: 'Focus on issue records, who received the seedlings, the distribution date, and what replacement or support may still be needed.',
      fields: [
        { key: 'seedlingSpecies', label: 'Seedling species', type: 'text' },
        { key: 'distributionDate', label: 'Distribution date', type: 'date' },
        { key: 'recipientsCount', label: 'Recipients reached', type: 'number' },
        { key: 'issuingOfficer', label: 'Issuing officer', type: 'text' },
        { key: 'replacementNeed', label: 'Replacement need', type: 'textarea' }
      ]
    },
    'Biogas Installation': {
      summary: 'Record the technical and household story: installation type, capacity, technician, livestock readiness, and operational status.',
      fields: [
        { key: 'householdName', label: 'Household or institution name', type: 'text' },
        { key: 'digesterType', label: 'Digester type', type: 'text' },
        { key: 'installationDate', label: 'Installation date', type: 'date' },
        { key: 'capacity', label: 'Capacity', type: 'number' },
        { key: 'livestockCount', label: 'Livestock count', type: 'number' },
        { key: 'technician', label: 'Technician', type: 'text' },
        { key: 'operationalStatus', label: 'Operational status', type: 'text' }
      ]
    },
    'Energy-saving Cookstoves': {
      summary: 'Keep the beneficiary and adoption story visible: stove type, quantity, training completion, and expected fuel-saving outcome.',
      fields: [
        { key: 'stoveType', label: 'Stove type', type: 'text' },
        { key: 'quantityInstalled', label: 'Quantity installed', type: 'number' },
        { key: 'trainingStatus', label: 'Training status', type: 'text' },
        { key: 'fuelSavingEstimate', label: 'Fuel-saving estimate', type: 'text' },
        { key: 'followUpStatus', label: 'Follow-up status', type: 'textarea' }
      ]
    },
    'Fish Farming': {
      summary: 'Tell the pond history properly with owner details, stocking data, feed or mortality notes, and harvest progress.',
      fields: [
        { key: 'pondOwner', label: 'Pond owner or group', type: 'text' },
        { key: 'pondSize', label: 'Pond size', type: 'text' },
        { key: 'fingerlingsSupplied', label: 'Fingerlings supplied', type: 'number' },
        { key: 'fishSpecies', label: 'Fish species', type: 'text' },
        { key: 'stockingDate', label: 'Stocking date', type: 'date' },
        { key: 'mortalityRecords', label: 'Mortality records', type: 'textarea' }
      ]
    },
    'Water Project': {
      summary: 'Capture service and protection context: water source type, households served, committee ownership, and quality or maintenance notes.',
      fields: [
        { key: 'waterSourceType', label: 'Water source type', type: 'text' },
        { key: 'householdsServed', label: 'Households served', type: 'number' },
        { key: 'protectionStatus', label: 'Protection status', type: 'text' },
        { key: 'committeeName', label: 'Committee or steward group', type: 'text' },
        { key: 'waterQualityNote', label: 'Water quality note', type: 'textarea' }
      ]
    },
    'Community Training': {
      summary: 'Keep the learning trail visible with topic, trainer, participants, outcomes, and the next support or mentorship step.',
      fields: [
        { key: 'sessionTopic', label: 'Session topic', type: 'text' },
        { key: 'traineesCount', label: 'Trainees reached', type: 'number' },
        { key: 'trainerName', label: 'Trainer name', type: 'text' },
        { key: 'keyOutcome', label: 'Key outcome', type: 'textarea' },
        { key: 'nextTrainingDate', label: 'Next training date', type: 'date' }
      ]
    },
    'Environmental Restoration': {
      summary: 'Show the site recovery story with method, area covered, species used, erosion severity, and monitoring observations.',
      fields: [
        { key: 'restorationMethod', label: 'Restoration method', type: 'text' },
        { key: 'areaCovered', label: 'Area covered', type: 'text' },
        { key: 'speciesUsed', label: 'Species used', type: 'text' },
        { key: 'erosionSeverity', label: 'Erosion severity', type: 'text' },
        { key: 'monitoringNote', label: 'Monitoring note', type: 'textarea' }
      ]
    },
    'School Programme': {
      summary: 'Keep the school story concrete: school, club, pupils, teacher coordination, and the next school-facing activity.',
      fields: [
        { key: 'schoolName', label: 'School name', type: 'text' },
        { key: 'clubName', label: 'Environment club name', type: 'text' },
        { key: 'pupilsReached', label: 'Pupils reached', type: 'number' },
        { key: 'teacherCoordinator', label: 'Teacher coordinator', type: 'text' },
        { key: 'clubActivity', label: 'Club activity notes', type: 'textarea' }
      ]
    },
    'Climate Action': {
      summary: 'Document the resilience narrative: theme, households reached, adaptation practice, risk notes, and the next review milestone.',
      fields: [
        { key: 'resilienceTheme', label: 'Resilience theme', type: 'text' },
        { key: 'householdsReached', label: 'Households reached', type: 'number' },
        { key: 'adaptationPractice', label: 'Adaptation practice', type: 'text' },
        { key: 'riskNote', label: 'Risk note', type: 'textarea' },
        { key: 'nextReviewDate', label: 'Next review date', type: 'date' }
      ]
    },
    'General Environmental Project': {
      summary: 'Use this flexible profile to capture the intervention type, target group, outcome note, evidence need, and follow-up action.',
      fields: [
        { key: 'interventionType', label: 'Intervention type', type: 'text' },
        { key: 'targetGroup', label: 'Target group', type: 'text' },
        { key: 'outputMeasure', label: 'Output measure', type: 'text' },
        { key: 'evidenceNeeded', label: 'Evidence needed', type: 'textarea' },
        { key: 'followUpAction', label: 'Follow-up action', type: 'textarea' }
      ]
    }
  };
  const DISTRIBUTION_ITEM_PROFILES = {
    'Tree Planting': {
      helper: 'Track the exact planting stock, quantities, losses, survival, and any linked beneficiary or field site for each distribution row.',
      itemTypeSuggestions: ['Tree seedlings', 'Fruit seedlings', 'Indigenous seedlings', 'Bamboo seedlings'],
      unitLabel: 'seedlings'
    },
    'Seedling Distribution': {
      helper: 'Capture every distributed batch separately so you can compare issued, destroyed, survived, replaced, and returned quantities later.',
      itemTypeSuggestions: ['Avocado seedlings', 'Grevillea seedlings', 'Macadamia seedlings', 'Mixed seedling batch'],
      unitLabel: 'seedlings'
    },
    'Biogas Installation': {
      helper: 'Use one row per installed or issued item, kit, or component so technical status can still be traced back later.',
      itemTypeSuggestions: ['Biogas unit', 'Pipe kit', 'Burner set', 'Digester material'],
      unitLabel: 'units'
    },
    'Energy-saving Cookstoves': {
      helper: 'Track the stove type, how many were issued, damaged, replaced, or still active for each linked household or group.',
      itemTypeSuggestions: ['Rocket stove', 'Institutional stove', 'Household stove', 'Cookstove liner'],
      unitLabel: 'stoves'
    },
    'Fish Farming': {
      helper: 'Capture fingerlings, feed, harvest tools, or other fish-farming items row by row for more accurate follow-up.',
      itemTypeSuggestions: ['Fingerlings', 'Fish feed', 'Netting', 'Water testing kit'],
      unitLabel: 'units'
    },
    'Water Project': {
      helper: 'Track distributed materials, water hardware, or consumables by location and linked beneficiary where needed.',
      itemTypeSuggestions: ['Water tank', 'Pipe', 'Tap stand', 'Water treatment pack'],
      unitLabel: 'units'
    }
  };
  const FORM_INTELLIGENCE_CONFIG = {
    project: { formId: 'projectForm', title: 'Project intelligence', insertBeforeSelector: '.form-actions' },
    beneficiary: { formId: 'beneficiaryForm', title: 'Beneficiary intelligence', insertBeforeSelector: '.form-actions' },
    location: { formId: 'locationForm', title: 'Location intelligence', insertBeforeSelector: '.form-actions' },
    excel_import: { formId: 'excelImportForm', title: 'Import intelligence', insertBeforeSelector: '.form-actions' },
    document: { formId: 'documentForm', title: 'Document intelligence', insertBeforeSelector: '.form-actions' },
    photo: { formId: 'photoForm', title: 'Media intelligence', insertBeforeSelector: '.form-actions' },
    map: { formId: 'mapForm', title: 'Map intelligence', insertBeforeSelector: '.form-actions' },
    activity: { formId: 'activityForm', title: 'Activity intelligence', insertBeforeSelector: '.form-actions' },
    duty: { formId: 'dutyForm', title: 'Duty intelligence', insertBeforeSelector: '.form-actions' },
    timeline: { formId: 'timelineForm', title: 'Timeline intelligence', insertBeforeSelector: '.form-actions' }
  };
  const ENVIRONMENT_SCHEMA_REGISTRY = Object.freeze({
    categories: {
      'Tree Planting': {
        projectProfile: PROJECT_CATEGORY_PROFILES['Tree Planting'],
        distributionProfile: DISTRIBUTION_ITEM_PROFILES['Tree Planting'],
        preferredEntryTarget: 'project',
        preferredActivityType: 'tree_planting',
        relatedRecordFocus: ['project', 'beneficiary', 'location', 'activity'],
        canonicalFields: ['treeSpecies', 'numberPlanted', 'plantingDate', 'survivalCount', 'followUpVisitNotes']
      },
      'Seedling Distribution': {
        projectProfile: PROJECT_CATEGORY_PROFILES['Seedling Distribution'],
        distributionProfile: DISTRIBUTION_ITEM_PROFILES['Seedling Distribution'],
        preferredEntryTarget: 'project',
        preferredActivityType: 'seedling_distribution',
        relatedRecordFocus: ['project', 'beneficiary', 'location', 'activity'],
        canonicalFields: ['seedlingSpecies', 'distributionDate', 'recipientsCount', 'seedlingsIssued', 'seedlingsSurvived', 'seedlingsLost']
      },
      'Biogas Installation': {
        projectProfile: PROJECT_CATEGORY_PROFILES['Biogas Installation'],
        distributionProfile: DISTRIBUTION_ITEM_PROFILES['Biogas Installation'],
        preferredEntryTarget: 'activity',
        preferredActivityType: 'biogas_installation',
        relatedRecordFocus: ['project', 'beneficiary', 'location', 'activity'],
        canonicalFields: ['householdName', 'digesterType', 'installationDate', 'capacity', 'livestockCount', 'technician']
      },
      'Energy-saving Cookstoves': {
        projectProfile: PROJECT_CATEGORY_PROFILES['Energy-saving Cookstoves'],
        distributionProfile: DISTRIBUTION_ITEM_PROFILES['Energy-saving Cookstoves'],
        preferredEntryTarget: 'activity',
        preferredActivityType: 'cookstove_installation',
        relatedRecordFocus: ['project', 'beneficiary', 'location', 'activity'],
        canonicalFields: ['stoveType', 'quantityInstalled', 'trainingStatus', 'fuelSavingEstimate', 'followUpStatus']
      },
      'Fish Farming': {
        projectProfile: PROJECT_CATEGORY_PROFILES['Fish Farming'],
        distributionProfile: DISTRIBUTION_ITEM_PROFILES['Fish Farming'],
        preferredEntryTarget: 'activity',
        preferredActivityType: 'fish_stocking',
        relatedRecordFocus: ['project', 'beneficiary', 'location', 'activity'],
        canonicalFields: ['pondOwner', 'pondSize', 'fingerlingsSupplied', 'fishSpecies', 'stockingDate', 'mortalityRecords']
      },
      'Water Project': {
        projectProfile: PROJECT_CATEGORY_PROFILES['Water Project'],
        distributionProfile: DISTRIBUTION_ITEM_PROFILES['Water Project'],
        preferredEntryTarget: 'project',
        preferredActivityType: 'water_project_work',
        relatedRecordFocus: ['project', 'beneficiary', 'location', 'activity'],
        canonicalFields: ['waterSourceType', 'householdsServed', 'protectionStatus', 'committeeName', 'waterQualityNote']
      },
      'Community Training': {
        projectProfile: PROJECT_CATEGORY_PROFILES['Community Training'],
        preferredEntryTarget: 'activity',
        preferredActivityType: 'community_training',
        relatedRecordFocus: ['project', 'beneficiary', 'location', 'activity'],
        canonicalFields: ['sessionTopic', 'traineesCount', 'trainerName', 'keyOutcome', 'nextTrainingDate']
      },
      'Environmental Restoration': {
        projectProfile: PROJECT_CATEGORY_PROFILES['Environmental Restoration'],
        preferredEntryTarget: 'project',
        preferredActivityType: 'environmental_restoration',
        relatedRecordFocus: ['project', 'location', 'activity'],
        canonicalFields: ['restorationMethod', 'areaCovered', 'speciesUsed', 'erosionSeverity', 'monitoringNote']
      },
      'School Programme': {
        projectProfile: PROJECT_CATEGORY_PROFILES['School Programme'],
        preferredEntryTarget: 'project',
        preferredActivityType: 'community_training',
        relatedRecordFocus: ['project', 'beneficiary', 'location', 'activity'],
        canonicalFields: ['schoolName', 'clubName', 'pupilsReached', 'teacherCoordinator', 'clubActivity']
      },
      'Climate Action': {
        projectProfile: PROJECT_CATEGORY_PROFILES['Climate Action'],
        preferredEntryTarget: 'project',
        preferredActivityType: 'general_activity',
        relatedRecordFocus: ['project', 'beneficiary', 'location', 'activity'],
        canonicalFields: ['resilienceTheme', 'householdsReached', 'adaptationPractice', 'riskNote', 'nextReviewDate']
      },
      'General Environmental Project': {
        projectProfile: PROJECT_CATEGORY_PROFILES['General Environmental Project'],
        preferredEntryTarget: 'project',
        preferredActivityType: 'general_activity',
        relatedRecordFocus: ['project', 'beneficiary', 'location', 'activity'],
        canonicalFields: ['interventionType', 'targetGroup', 'outputMeasure', 'evidenceNeeded', 'followUpAction']
      }
    },
    recordTemplates: {
      project: {
        label: 'Project',
        preferredFields: ['title', 'categoryId', 'beneficiaryIds', 'locationIds', 'summary']
      },
      beneficiary: {
        label: 'Beneficiary',
        preferredFields: ['name', 'type', 'projectIds', 'locationIds', 'notes']
      },
      location: {
        label: 'Location',
        preferredFields: ['name', 'locationType', 'county', 'ward', 'village']
      },
      activity: {
        label: 'Activity',
        preferredFields: ['title', 'activityType', 'projectId', 'beneficiaryId', 'locationId', 'metricsJson']
      },
      duty: {
        label: 'Duty',
        preferredFields: ['title', 'dutyType', 'assignedUserId', 'projectId', 'locationId', 'dueDate']
      },
      map: {
        label: 'Map',
        preferredFields: ['title', 'sourceType', 'projectId', 'locationId', 'latitude', 'longitude']
      }
    }
  });

  const state = {
    bootstrap: null,
    currentUser: null,
    currentSection: 'dashboardSection',
    breadcrumbs: [],
    sectionSaveForms: {},
    currentEntity: null,
    entitySlider: null,
    selectedProjectId: null,
    selectedBeneficiaryId: null,
    selectedLocationId: null,
    selectedDocumentId: null,
    selectedExcelImportId: null,
    selectedExcelMappingProfileId: null,
    selectedExcelProfileMatchOnly: false,
    selectedWorkbookSheetKey: null,
    selectedEntryId: null,
    selectedActivityId: null,
    selectedDutyId: null,
    selectedMapId: null,
    selectedPhotoId: null,
    selectedTimelineId: null,
    selectedReportId: null,
    selectedCalendarDay: null,
    reportHtml: '',
    views: {},
    tablePaging: {},
    tableRenderers: {}
  };

  const PROJECT_CUSTOM_FIELD_INSERT_OPTIONS = [
    { value: 'title', label: 'Project title' },
    { value: 'projectCode', label: 'Project code' },
    { value: 'categoryId', label: 'Category' },
    { value: 'status', label: 'Status' },
    { value: 'projectStage', label: 'Project stage' },
    { value: 'projectOfficer', label: 'Project officer' },
    { value: 'county', label: 'County' },
    { value: 'subCounty', label: 'Sub-county' },
    { value: 'ward', label: 'Ward' },
    { value: 'village', label: 'Village/community' },
    { value: 'latitude', label: 'Latitude' },
    { value: 'longitude', label: 'Longitude' },
    { value: 'locationIds', label: 'Locations' },
    { value: 'beneficiaryIds', label: 'Beneficiaries' },
    { value: 'dateStarted', label: 'Date started' },
    { value: 'dateCompleted', label: 'Date completed' },
    { value: 'seedlingsIssued', label: 'Seedlings issued' },
    { value: 'seedlingsSurvived', label: 'Seedlings survived' },
    { value: 'seedlingsLost', label: 'Seedlings died/withered/destroyed' },
    { value: 'seedlingLossReasons', label: 'Reasons for seedling loss' },
    { value: 'budgetAmount', label: 'Budget/cost estimate' },
    { value: 'actualCost', label: 'Actual cost' },
    { value: 'donorName', label: 'Donor/funding source' },
    { value: 'verificationStatus', label: 'Verification status' },
    { value: 'summary', label: 'Project summary' },
    { value: 'backgroundStory', label: 'Project story/background' },
    { value: 'objective', label: 'Objective' },
    { value: 'description', label: 'Description' },
    { value: 'notes', label: 'Notes' },
    { value: 'tags', label: 'Tags' }
  ];
  const GENERIC_CUSTOM_FIELD_INSERT_OPTIONS = Object.freeze({
    category: [
      { value: 'name', label: 'Category name' },
      { value: 'description', label: 'Description' }
    ],
    beneficiary: [
      { value: 'name', label: 'Beneficiary name' },
      { value: 'type', label: 'Beneficiary type' },
      { value: 'beneficiaryCode', label: 'Reference/code' },
      { value: 'county', label: 'County' },
      { value: 'subCounty', label: 'Sub-county' },
      { value: 'ward', label: 'Ward' },
      { value: 'village', label: 'Village/community' },
      { value: 'contactPerson', label: 'Contact person' },
      { value: 'notes', label: 'Notes' },
      { value: 'tags', label: 'Tags' }
    ],
    location: [
      { value: 'name', label: 'Location name' },
      { value: 'locationType', label: 'Location type' },
      { value: 'county', label: 'County' },
      { value: 'subCounty', label: 'Sub-county' },
      { value: 'ward', label: 'Ward' },
      { value: 'village', label: 'Village/community' },
      { value: 'notes', label: 'Notes' },
      { value: 'tags', label: 'Tags' }
    ],
    document: [
      { value: 'filePath', label: 'Selected file' },
      { value: 'relatedProjectId', label: 'Linked project' },
      { value: 'beneficiaryId', label: 'Linked beneficiary' },
      { value: 'locationId', label: 'Linked location' },
      { value: 'activityId', label: 'Linked activity' },
      { value: 'categoryId', label: 'Category' },
      { value: 'description', label: 'Description' },
      { value: 'tags', label: 'Tags' }
    ],
    photo: [
      { value: 'title', label: 'Photo title' },
      { value: 'category', label: 'Photo category' },
      { value: 'projectId', label: 'Linked project' },
      { value: 'beneficiaryId', label: 'Linked beneficiary' },
      { value: 'locationId', label: 'Linked location' },
      { value: 'activityId', label: 'Linked activity' },
      { value: 'description', label: 'Description' },
      { value: 'tags', label: 'Tags' }
    ],
    map: [
      { value: 'title', label: 'Map title' },
      { value: 'sourceType', label: 'Source type' },
      { value: 'projectId', label: 'Linked project' },
      { value: 'beneficiaryId', label: 'Linked beneficiary' },
      { value: 'locationId', label: 'Linked location' },
      { value: 'activityId', label: 'Linked activity' },
      { value: 'notes', label: 'Notes' },
      { value: 'tags', label: 'Tags' }
    ],
    activity: [
      { value: 'title', label: 'Activity title' },
      { value: 'activityType', label: 'Activity type' },
      { value: 'categoryId', label: 'Category' },
      { value: 'projectId', label: 'Project' },
      { value: 'beneficiaryId', label: 'Beneficiary' },
      { value: 'locationId', label: 'Location' },
      { value: 'followUpStatus', label: 'Follow-up status' },
      { value: 'notes', label: 'Notes' },
      { value: 'tags', label: 'Tags' }
    ],
    duty: [
      { value: 'title', label: 'Duty title' },
      { value: 'dutyType', label: 'Duty type' },
      { value: 'assignedUserId', label: 'Assigned user' },
      { value: 'assignedBeneficiaryId', label: 'Assigned beneficiary' },
      { value: 'projectId', label: 'Project' },
      { value: 'locationId', label: 'Location' },
      { value: 'status', label: 'Status' },
      { value: 'priority', label: 'Priority' },
      { value: 'notes', label: 'Notes' }
    ],
    timeline: [
      { value: 'entryDate', label: 'Date' },
      { value: 'entryType', label: 'Entry type' },
      { value: 'title', label: 'Title' },
      { value: 'projectId', label: 'Project' },
      { value: 'beneficiaryId', label: 'Beneficiary' },
      { value: 'locationId', label: 'Location' },
      { value: 'activityId', label: 'Activity' },
      { value: 'description', label: 'Description' }
    ],
    project_item: [
      { value: 'projectId', label: 'Project' },
      { value: 'categoryId', label: 'Category' },
      { value: 'itemType', label: 'Item type' },
      { value: 'itemSubtype', label: 'Item subtype' },
      { value: 'unitLabel', label: 'Unit label' },
      { value: 'status', label: 'Status' },
      { value: 'quantityDistributed', label: 'Quantity distributed' },
      { value: 'quantityDestroyed', label: 'Destroyed' },
      { value: 'quantitySurvived', label: 'Survived/active' },
      { value: 'quantityReturned', label: 'Returned' },
      { value: 'quantityReplaced', label: 'Replaced' },
      { value: 'distributionDate', label: 'Distribution date' },
      { value: 'relatedBeneficiaryId', label: 'Beneficiary' },
      { value: 'relatedLocationId', label: 'Location' },
      { value: 'notes', label: 'Distribution notes' }
    ]
  });
  const CUSTOM_FIELD_ENTITY_OPTIONS = [
    { value: 'category', label: 'Project categories' },
    { value: 'project', label: 'Projects' },
    { value: 'beneficiary', label: 'Beneficiaries' },
    { value: 'location', label: 'Locations' },
    { value: 'document', label: 'Documents' },
    { value: 'photo', label: 'Photos' },
    { value: 'map', label: 'Maps' },
    { value: 'activity', label: 'Activities' },
    { value: 'duty', label: 'Duties' },
    { value: 'timeline', label: 'Timeline notes' },
    { value: 'project_item', label: 'Project items' }
  ];
  const CUSTOM_FIELD_FORM_CONFIG = Object.freeze({
    category: { formId: 'categoryForm', dataFieldName: 'customDataJson', fallbackFieldName: 'description' },
    project: { formId: 'projectForm', dataFieldName: 'customData', categoryFieldName: 'categoryId', fallbackFieldName: 'customData' },
    beneficiary: { formId: 'beneficiaryForm', dataFieldName: 'customDataJson', fallbackFieldName: 'tags' },
    location: { formId: 'locationForm', dataFieldName: 'customDataJson', fallbackFieldName: 'tags' },
    document: { formId: 'documentForm', dataFieldName: 'customDataJson', categoryFieldName: 'categoryId', fallbackFieldName: 'tags' },
    photo: { formId: 'photoForm', dataFieldName: 'customDataJson', fallbackFieldName: 'tags' },
    map: { formId: 'mapForm', dataFieldName: 'customDataJson', fallbackFieldName: 'tags' },
    activity: { formId: 'activityForm', dataFieldName: 'customDataJson', categoryFieldName: 'categoryId', fallbackFieldName: 'tags' },
    duty: { formId: 'dutyForm', dataFieldName: 'customDataJson', fallbackFieldName: 'notes' },
    timeline: { formId: 'timelineForm', dataFieldName: 'customDataJson', fallbackFieldName: 'description' },
    project_item: { formId: 'projectItemForm', dataFieldName: 'customDataJson', categoryFieldName: 'categoryId', fallbackFieldName: 'notes' }
  });

  function byId(id) {
    return document.getElementById(id);
  }

  function hasElectronBridge() {
    return !!(window.environmentApp && typeof window.environmentApp.getBootstrap === 'function');
  }

  function escapeHtml(value) {
    return String(value === null || value === undefined ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function humanise(value) {
    return String(value || '')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  function formatDate(value) {
    if (!value) {
      return 'Not recorded';
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return String(value);
    }
    return parsed.toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function formatDateTime(value) {
    if (!value) {
      return 'Not recorded';
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return String(value);
    }
    return parsed.toLocaleString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function formatFileSize(bytes) {
    const size = Number(bytes || 0);
    if (!size) {
      return 'Unknown';
    }
    if (size < 1024) {
      return `${size} B`;
    }
    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }

  function debounce(fn, delay = 260) {
    let timer = null;
    return (...args) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => fn(...args), delay);
    };
  }

  function defaultPhotoTitleFromName(fileName) {
    return String(fileName || 'Photo evidence')
      .replace(/\.[^.]+$/, '')
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim() || 'Photo evidence';
  }

  function renderPhotoUploadQueue(files) {
    const target = byId('photoUploadQueue');
    if (!target) {
      return;
    }
    const safeFiles = Array.from(files || []);
    if (!safeFiles.length) {
      target.innerHTML = '<div class="empty-state">Choose one or more images to prepare titles, descriptions, dates, and categories before uploading.</div>';
      renderFormIntelligence('photo');
      return;
    }

    target.innerHTML = safeFiles.map((file, index) => `
      <div class="media-upload-row" data-file-index="${index}">
        <div class="media-upload-preview">
          <strong>${escapeHtml(file.name || `Image ${index + 1}`)}</strong>
          <small>${escapeHtml(formatFileSize(file.size || 0))}</small>
        </div>
        <label><span>Title</span><input type="text" name="queuedTitle" value="${escapeHtml(defaultPhotoTitleFromName(file.name))}" required></label>
        <label><span>Category</span><select name="queuedCategory">${PHOTO_CATEGORIES.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(humanise(category))}</option>`).join('')}</select></label>
        <label><span>Date</span><input type="date" name="queuedDate"></label>
        <label class="full-span"><span>Description</span><textarea name="queuedDescription" rows="2" placeholder="Describe what this image shows and why it matters."></textarea></label>
      </div>
    `).join('');
    renderFormIntelligence('photo');
  }

  function setPhotoFormMode(mode = 'create', photo = null) {
    const form = byId('photoForm');
    if (!form) {
      return;
    }
    const fileInput = getFormField(form, 'filePath');
    const manageMode = getFormField(form, 'manageMode');
    const hiddenId = getFormField(form, 'id');
    const submitButton = byId('photoFormSubmitButton');
    const notice = byId('photoFormModeNotice');
    const isManageMode = mode === 'edit' || mode === 'replace';

    manageMode.value = isManageMode ? mode : 'create';
    hiddenId.value = photo && photo.id ? String(photo.id) : '';
    fileInput.required = !isManageMode;
    fileInput.multiple = !isManageMode;
    setRepeatableUploadFieldMode(form, 'filePath', {
      allowAdditionalRows: !isManageMode,
      allowMultiplePerInput: !isManageMode
    });

    if (submitButton) {
      submitButton.textContent = isManageMode ? 'Save photo changes' : 'Upload linked images';
    }

    if (notice) {
      if (mode === 'edit' && photo) {
        notice.textContent = `Editing "${photo.title}". Update the details below, or choose a new file to replace the current image before saving.`;
        notice.classList.remove('hidden');
      } else if (mode === 'replace' && photo) {
        notice.textContent = `Replacing "${photo.title}". Choose the new image file, then save the changes.`;
        notice.classList.remove('hidden');
      } else {
        notice.textContent = '';
        notice.classList.add('hidden');
      }
    }
  }

  function resetPhotoForm() {
    const form = byId('photoForm');
    if (!form) {
      return;
    }
    form.reset();
    getFormField(form, 'id').value = '';
    getFormField(form, 'manageMode').value = 'create';
    setFormCustomData('photo', {});
    setPhotoFormMode('create');
    injectEntityCustomFields('photo', {});
    renderPhotoUploadQueue([]);
    renderFormIntelligence('photo');
  }

  function populatePhotoForm(photo, mode = 'edit') {
    const form = byId('photoForm');
    if (!form || !photo) {
      return;
    }
    getFormField(form, 'id').value = photo.id || '';
    getFormField(form, 'projectId').value = photo.projectId || '';
    getFormField(form, 'beneficiaryId').value = photo.beneficiaryId || '';
    getFormField(form, 'locationId').value = photo.locationId || '';
    getFormField(form, 'activityId').value = photo.activityId || '';
    getFormField(form, 'tags').value = photo.tags || '';
    setFormCustomData('photo', photo.customData || {});
    injectEntityCustomFields('photo', photo.customData || {});
    setPhotoFormMode(mode, photo);
    const queueTarget = byId('photoUploadQueue');
    if (queueTarget) {
      queueTarget.innerHTML = `
        <div class="media-upload-row media-upload-row-static">
          <div class="media-upload-preview">
            <strong>${escapeHtml(photo.originalFilename || photo.title)}</strong>
            <small>${escapeHtml(mode === 'replace' ? 'Select one replacement file below.' : 'Existing file will be kept unless you choose a new one.')}</small>
          </div>
          <label><span>Title</span><input type="text" name="queuedTitle" value="${escapeHtml(photo.title || '')}" required></label>
          <label><span>Category</span><select name="queuedCategory">${PHOTO_CATEGORIES.map((category) => `<option value="${escapeHtml(category)}" ${photo.category === category ? 'selected' : ''}>${escapeHtml(humanise(category))}</option>`).join('')}</select></label>
          <label><span>Date</span><input type="date" name="queuedDate" value="${escapeHtml(photo.photoDate || '')}"></label>
          <label class="full-span"><span>Description</span><textarea name="queuedDescription" rows="2" placeholder="Describe what this image shows and why it matters.">${escapeHtml(photo.description || '')}</textarea></label>
        </div>
      `;
    }
    switchSection('photosSection', getBranding().mediaSectionLabel || 'Photo Evidence');
    renderFormIntelligence('photo');
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function getQueuedPhotoPayloads(form) {
    const files = getSelectedUploadFiles(form, 'filePath');
    const rows = Array.from(byId('photoUploadQueue')?.querySelectorAll('.media-upload-row') || []);
    const isManageMode = !!getFormField(form, 'id').value;
    if (!files.length && !isManageMode) {
      throw new Error('Please choose one or more image files to upload.');
    }
    if (!rows.length) {
      throw new Error('No image details are available to save.');
    }
    if (files.length && rows.length !== files.length) {
      throw new Error('The image details queue is out of sync. Please choose the files again.');
    }
    const sourceRows = files.length ? rows : rows.slice(0, 1);
    return sourceRows.map((row, index) => {
      const file = files[index] || null;
      const titleField = row.querySelector('[name="queuedTitle"]');
      const categoryField = row.querySelector('[name="queuedCategory"]');
      const dateField = row.querySelector('[name="queuedDate"]');
      const descriptionField = row.querySelector('[name="queuedDescription"]');
      const title = String(titleField?.value || '').trim();
      if (!title) {
        throw new Error(`Please provide a title for image ${index + 1}.`);
      }
      return {
        filePath: file && file.path ? file.path : '',
        mimeType: file && file.type ? file.type : '',
        title,
        category: categoryField?.value || 'general_evidence',
        photoDate: dateField?.value || '',
        description: String(descriptionField?.value || '').trim()
      };
    });
  }

  function getBranding() {
    return (state.bootstrap && state.bootstrap.appBranding) || {
      organisationTitle: 'Organisation Workspace',
      appTitle: 'PFine Organisation Project Management Application',
      appTagline: 'Offline-first project documentation and impact management workspace',
      mediaSectionLabel: 'Photo Evidence',
      logoPath: 'assets/branding/ksie-letterhead.png',
      iconPath: 'assets/icons/app-icon-256.png'
    };
  }

  function buildProjectSeedlingSummary(project) {
    const values = [
      project.seedlingsIssued !== null && project.seedlingsIssued !== undefined && project.seedlingsIssued !== '' ? `Issued ${project.seedlingsIssued}` : '',
      project.seedlingsSurvived !== null && project.seedlingsSurvived !== undefined && project.seedlingsSurvived !== '' ? `Survived ${project.seedlingsSurvived}` : '',
      project.seedlingsLost !== null && project.seedlingsLost !== undefined && project.seedlingsLost !== '' ? `Lost ${project.seedlingsLost}` : ''
    ].filter(Boolean);

    if (project.seedlingLossReasons) {
      values.push(`Reasons: ${project.seedlingLossReasons}`);
    }

    return values.join(' | ') || 'Not recorded';
  }

  function assetUrl(filePath) {
    const value = String(filePath || '').trim();
    if (!value) {
      return '';
    }
    if (/^[a-zA-Z]:\\/.test(value)) {
      return `file:///${escapeHtml(value.replace(/\\/g, '/'))}`;
    }
    return value;
  }

  function applyBranding() {
    const branding = getBranding();
    document.title = branding.appTitle || 'PFine Organisation Project Management Application';
    const favicon = byId('appFavicon');
    if (favicon) {
      favicon.href = assetUrl(branding.iconPath) || 'assets/icons/app-icon-256.png';
    }
    const loginLogo = byId('loginBrandLogo');
    const sidebarLogo = byId('sidebarBrandLogo');
    const sidebarAppTitle = byId('sidebarAppTitle');
    if (loginLogo) {
      loginLogo.src = assetUrl(branding.logoPath) || 'assets/branding/ksie-letterhead.png';
      loginLogo.alt = `${branding.organisationTitle} logo`;
    }
    if (sidebarLogo) {
      sidebarLogo.src = assetUrl(branding.logoPath) || 'assets/branding/ksie-letterhead.png';
      sidebarLogo.alt = `${branding.organisationTitle} logo`;
    }
    const loginEyebrow = byId('loginOrganisationEyebrow');
    const sidebarEyebrow = byId('sidebarOrganisationEyebrow');
    const loginAppTitle = byId('loginAppTitle');
    const loginTagline = byId('loginTaglineText');
    const mediaSectionLabel = branding.mediaSectionLabel || 'Photo Evidence';
    if (loginEyebrow) {
      loginEyebrow.textContent = branding.organisationTitle || 'Organisation Workspace';
    }
    if (sidebarEyebrow) {
      sidebarEyebrow.textContent = branding.organisationTitle || 'Organisation Workspace';
    }
    if (loginAppTitle) {
      loginAppTitle.textContent = branding.appTitle || 'PFine Organisation Project Management Application';
    }
    if (sidebarAppTitle) {
      sidebarAppTitle.textContent = branding.appTitle || 'PFine Organisation Project Management Application';
    }
    if (loginTagline) {
      loginTagline.textContent = branding.appTagline || 'Offline-first project documentation and impact management workspace';
    }
    const mediaNav = byId('photosSectionNavButton');
    const photoUploadHeading = byId('photoUploadHeading');
    const photoGalleryHeading = byId('photoGalleryHeading');
    const photoSearchInput = byId('photoSearchInput');
    if (mediaNav) {
      mediaNav.textContent = mediaSectionLabel;
    }
    if (photoUploadHeading) {
      photoUploadHeading.textContent = `Upload and interlink ${String(mediaSectionLabel).toLowerCase()}`;
    }
    if (photoGalleryHeading) {
      photoGalleryHeading.textContent = `${mediaSectionLabel} gallery`;
    }
    if (photoSearchInput) {
      photoSearchInput.placeholder = `Search ${String(mediaSectionLabel).toLowerCase()}`;
    }
  }

  function getPricingBrandProfile() {
    return {
      productName: 'Project Documentation & Impact Management System',
      alternateProductName: 'Community Project Records & Evidence Management App'
    };
  }

  function renderAboutPage() {
    const target = byId('aboutPageContent');
    if (!target) {
      return;
    }
    const brand = getPricingBrandProfile();
    target.innerHTML = `
      <div class="pricing-shell">
        <section class="pricing-hero card">
          <div class="pricing-hero-copy">
            <p class="eyebrow">About the Software</p>
            <h2>${escapeHtml(brand.productName)}</h2>
            <p class="pricing-lead">An offline-first desktop application for structured project documentation, beneficiary history, location tracking, activity evidence, map context, reporting support, and long-term organisational memory.</p>
            <div class="pricing-price-block">
              <span class="pricing-price-label">Creator</span>
              <strong>Patrick Wilson Githinji (PFine)</strong>
              <small>Developer, product builder, and system owner.</small>
            </div>
            <p class="pricing-value-note">This application was designed to help organisations replace scattered folders, loose spreadsheets, disconnected photos, and fragmented field notes with one coordinated operational record system.</p>
          </div>
          <div class="pricing-highlight-panel">
            <div class="pricing-badge-grid">
              <span class="status-badge">Offline-first</span>
              <span class="status-badge">Desktop installable</span>
              <span class="status-badge">Linked dossiers</span>
              <span class="status-badge">Evidence ready</span>
            </div>
            <div class="pricing-metric-list">
              <div class="metric-item"><span>Product wording</span><strong>${escapeHtml(brand.productName)}</strong></div>
              <div class="metric-item"><span>Alternate wording</span><strong>${escapeHtml(brand.alternateProductName)}</strong></div>
              <div class="metric-item"><span>Software type</span><strong>Offline-first impact management application</strong></div>
              <div class="metric-item"><span>Created by</span><strong>Patrick Wilson Githinji Alias PFine</strong></div>
            </div>
          </div>
        </section>

        <section class="card pricing-section-block">
          <div class="section-heading"><h2>What this software does</h2></div>
          <div class="pricing-two-column">
            <div class="helper-block">The software helps an organisation record projects, categories, beneficiaries, locations, activities, duties, maps, documents, photo evidence, imported data, reports, and timeline history in one coordinated workspace.</div>
            <div class="helper-block">Its main strength is not just saving records. It links records into connected story pages so users can move from project to beneficiary to location to activity to evidence to reporting context more intelligently.</div>
          </div>
        </section>

        <section class="card pricing-section-block">
          <div class="section-heading"><h2>Core software capabilities</h2></div>
          <div class="pricing-feature-grid">
            <article class="pricing-feature-card"><h3>Project management records</h3><p>Create and manage project records with categories, status, dates, notes, story context, and linked operational evidence.</p></article>
            <article class="pricing-feature-card"><h3>Beneficiary documentation</h3><p>Keep beneficiary, household, group, school, institution, and community records with linked support history and related evidence.</p></article>
            <article class="pricing-feature-card"><h3>Location intelligence</h3><p>Document counties, sub-counties, wards, villages, and field sites while linking them back to projects, beneficiaries, maps, and activities.</p></article>
            <article class="pricing-feature-card"><h3>Activity and duty tracking</h3><p>Track field work, follow-ups, assignments, completions, failures, reschedules, and operational accountability through structured activity and duty records.</p></article>
            <article class="pricing-feature-card"><h3>Evidence and media capture</h3><p>Attach documents, photos, reference files, and map evidence to the exact records they support so historical proof is easier to retrieve.</p></article>
            <article class="pricing-feature-card"><h3>Map support</h3><p>Support uploaded map imagery, Google static map capture, and embeddable Google map views tied into the same relationship story as other records.</p></article>
            <article class="pricing-feature-card"><h3>Entity dossier pages</h3><p>Open full professional record pages for projects, beneficiaries, locations, maps, activities, duties, evidence, reports, and related items.</p></article>
            <article class="pricing-feature-card"><h3>Import and extraction support</h3><p>Store imported workbook and extracted data records in a structured way so rows, evidence, and review history can remain retrievable.</p></article>
            <article class="pricing-feature-card"><h3>Printable reporting surfaces</h3><p>Generate print-ready pages that help present work professionally to management, donors, partners, reviewers, and internal teams.</p></article>
          </div>
        </section>

        <section class="card pricing-section-block">
          <div class="section-heading"><h2>Why it is professionally valuable</h2></div>
          <div class="pricing-list-grid">
            <div class="linked-card"><h4>Operational clarity</h4><div>It brings multiple record types into one coordinated structure instead of forcing staff to search through disconnected folders and files.</div></div>
            <div class="linked-card"><h4>Historical continuity</h4><div>It preserves the story of what happened, where it happened, who was involved, and what evidence supports that work.</div></div>
            <div class="linked-card"><h4>Review readiness</h4><div>It makes internal reviews, donor updates, supervision, and accountability checks easier because the evidence chain is more visible.</div></div>
            <div class="linked-card"><h4>Professional presentation</h4><div>The software is structured to present records as serious organisational assets rather than rough disconnected data entries.</div></div>
            <div class="linked-card"><h4>Growth readiness</h4><div>It is already shaped in a way that can support future client deployments, branding, and broader organisational use.</div></div>
          </div>
        </section>

        <section class="card pricing-section-block">
          <div class="section-heading"><h2>Software architecture direction</h2></div>
          <div class="pricing-include-grid">
            <div class="detail-card"><strong>Offline-first desktop workflow</strong><span>Designed to run locally without depending on a constant internet connection.</span></div>
            <div class="detail-card"><strong>Installer-ready desktop surface</strong><span>Structured for packaged Windows installation and local operational use.</span></div>
            <div class="detail-card"><strong>Linked relationship model</strong><span>Records are designed to reciprocate across pages so users can follow context instead of hitting dead ends.</span></div>
            <div class="detail-card"><strong>Controlled local storage</strong><span>Documents, images, exports, and the database are managed in a controlled local application data path.</span></div>
            <div class="detail-card"><strong>Custom field flexibility</strong><span>Supports extensibility for multiple forms and evolving operational record needs.</span></div>
            <div class="detail-card"><strong>Future-ready structure</strong><span>Built with room for broader deployment, richer reporting, and deeper organisational intelligence over time.</span></div>
          </div>
        </section>

        <section class="card pricing-section-block">
          <div class="section-heading"><h2>Best fit organisations</h2></div>
          <div class="pricing-badge-grid expanded">
            <span class="status-badge">Environmental organisations</span>
            <span class="status-badge">Community programmes</span>
            <span class="status-badge">Impact-focused NGOs</span>
            <span class="status-badge">Grant-managed projects</span>
            <span class="status-badge">Field documentation teams</span>
            <span class="status-badge">Training and outreach programmes</span>
            <span class="status-badge">Schools and institutions</span>
            <span class="status-badge">Local development organisations</span>
            <span class="status-badge">Faith-based projects</span>
            <span class="status-badge">Multi-record accountability environments</span>
          </div>
        </section>

        <section class="card pricing-section-block">
          <div class="section-heading"><h2>Developer note</h2></div>
          <div class="pricing-two-column">
            <div class="helper-block">This software reflects deliberate work toward a more coordinated project intelligence system, where each page is meant to contribute to a stronger overall picture of the organisation’s work and history.</div>
            <div class="helper-block">Developer identity for this application: Patrick Wilson Githinji, also known as PFine.</div>
          </div>
        </section>
      </div>
    `;
  }

  function renderFaqPage() {
    const target = byId('faqPageContent');
    if (!target) {
      return;
    }
    target.innerHTML = `
      <div class="pricing-shell">
        <section class="pricing-hero card">
          <div class="pricing-hero-copy">
            <p class="eyebrow">Beginner Help</p>
            <h2>Frequently Asked Questions</h2>
            <p class="pricing-lead">A practical help page for new users who want to understand what this software does, where to click, and how the connected record system works.</p>
            <div class="pricing-price-block">
              <span class="pricing-price-label">Purpose</span>
              <strong>Help New Users Start Well</strong>
              <small>Designed to reduce confusion and make the app easier to understand from the first visit.</small>
            </div>
            <p class="pricing-value-note">This page explains the software using the real features already built into the application rather than generic filler guidance.</p>
          </div>
          <div class="pricing-highlight-panel">
            <div class="pricing-badge-grid">
              <span class="status-badge">New user help</span>
              <span class="status-badge">Feature-based answers</span>
              <span class="status-badge">Workflow guidance</span>
              <span class="status-badge">Beginner friendly</span>
            </div>
            <div class="pricing-metric-list">
              <div class="metric-item"><span>Best starting page</span><strong>Command Centre</strong></div>
              <div class="metric-item"><span>Best relationship page</span><strong>Entity Explorer</strong></div>
              <div class="metric-item"><span>Main record flow</span><strong>Project to linked evidence story</strong></div>
              <div class="metric-item"><span>Help focus</span><strong>How the built features work together</strong></div>
            </div>
          </div>
        </section>

        <section class="card pricing-section-block">
          <div class="section-heading"><h2>Frequently asked questions</h2></div>
          <div class="pricing-faq-grid">
            <article class="pricing-faq-item"><h3>What is this software mainly for?</h3><p>It is for recording projects, beneficiaries, locations, activities, maps, duties, documents, photos, imported data, and reports in one coordinated desktop workspace so the organisation can preserve both current work and historical evidence.</p></article>
            <article class="pricing-faq-item"><h3>Where should a new user start?</h3><p>Start on Command Centre. It gives a high-level picture of recent records, suggested actions, suggested reviews, and overall operational direction before moving into specific sections.</p></article>
            <article class="pricing-faq-item"><h3>What is Entity Explorer?</h3><p>Entity Explorer is the full-page relationship view. It is where a user opens a project, beneficiary, location, map, activity, duty, document, photo, report, or other item and sees its connected story, linked records, and history on one page.</p></article>
            <article class="pricing-faq-item"><h3>What is the difference between Projects and Project Categories?</h3><p>Project Categories define the type or family of work, while Projects are the actual operational records created under those categories. Categories help organise similar projects and support category-aware records.</p></article>
            <article class="pricing-faq-item"><h3>What are Project Items used for?</h3><p>Project Items help track distributed or managed items in a more structured way, including quantities, outcomes, sub-items, linked beneficiary context, linked location context, and related project history.</p></article>
            <article class="pricing-faq-item"><h3>Why are beneficiaries important in this app?</h3><p>Beneficiaries help show who received support, who was involved, or who is connected to project work. Their pages can connect to projects, locations, items, evidence, activities, and reports.</p></article>
            <article class="pricing-faq-item"><h3>Why do locations matter so much?</h3><p>Locations help the organisation preserve place-based history. They anchor records geographically and make it easier to understand where work happened, where beneficiaries are, and where evidence belongs.</p></article>
            <article class="pricing-faq-item"><h3>What is the purpose of the Maps section?</h3><p>The Maps section stores spatial context. It can keep uploaded map imagery, static map captures, or embedded Google map views and link them back to projects, activities, duties, locations, and evidence.</p></article>
            <article class="pricing-faq-item"><h3>Why do Activities and Duties exist as separate sections?</h3><p>Activities record work that happened. Duties record work assigned, planned, completed, failed, or rescheduled. This separation helps the organisation distinguish between documented field events and task accountability.</p></article>
            <article class="pricing-faq-item"><h3>What are Documents and Photo Evidence for?</h3><p>Documents and Photo Evidence keep proof materials tied to the exact records they support. This makes future review, reporting, and historical verification much easier than storing files in random folders.</p></article>
            <article class="pricing-faq-item"><h3>What are Excel Imports and extracted entries?</h3><p>Excel Imports help bring structured data into the app. Extracted entries preserve smaller retrievable pieces from imported or processed records so they can later be reviewed, linked, and used more intelligently.</p></article>
            <article class="pricing-faq-item"><h3>What is the Timeline for?</h3><p>The Timeline helps show history over time. It brings together important events and status changes so the organisation can see a clearer narrative of progress, work done, and connected evidence.</p></article>
            <article class="pricing-faq-item"><h3>What is the Calendar for?</h3><p>The Calendar gives a date-based view of activity, duty, and other scheduled or dated records. It helps users understand operational timing and navigate from calendar days into full related pages.</p></article>
            <article class="pricing-faq-item"><h3>What kind of reports can this app support?</h3><p>The app supports report generation based on projects, beneficiaries, locations, activities, imported data, and broader summaries. The goal is to make records easier to present and print in a professional form.</p></article>
            <article class="pricing-faq-item"><h3>What are custom fields?</h3><p>Custom fields allow the software to adapt to different forms and project needs without forcing every organisation to use only one rigid record structure. They support flexible data capture across multiple modules.</p></article>
            <article class="pricing-faq-item"><h3>Why do some pages feel connected to each other?</h3><p>That is intentional. The software was built to make records reciprocate as much as possible so that a user can move from one page to another and still keep context instead of starting over each time.</p></article>
            <article class="pricing-faq-item"><h3>What do the status buttons like completed, failed, and rescheduled mean?</h3><p>They help users keep projects, duties, and activities operationally honest. Instead of leaving records vague, the app supports clear status tracking and related history updates.</p></article>
            <article class="pricing-faq-item"><h3>Can the app work without internet?</h3><p>Yes, it is designed as an offline-first desktop application. Some external services such as live Google embeds still need internet, but the main record system is designed for local operational use.</p></article>
            <article class="pricing-faq-item"><h3>Who created this software?</h3><p>The software is created by Patrick Wilson Githinji, also known as PFine.</p></article>
            <article class="pricing-faq-item"><h3>What is the best way to learn the software quickly?</h3><p>Create one sample project, one beneficiary, one location, one activity, one map, one document, and one photo, then open each full page in Entity Explorer and follow the linked relationships. That gives the fastest understanding of how the app works.</p></article>
          </div>
        </section>
      </div>
    `;
  }

  function renderPricing() {
    const target = byId('pricingPageContent');
    if (!target) {
      return;
    }
    const brand = getPricingBrandProfile();
    target.innerHTML = `
      <div class="pricing-shell">
        <section class="pricing-hero card">
          <div class="pricing-hero-copy">
            <p class="eyebrow">Lifetime Licence Pricing</p>
            <h2>Lifetime Licence for Project Documentation &amp; Impact Management</h2>
            <p class="pricing-lead">A flexible project records, beneficiary tracking, location documentation, activity evidence, media, document, and accountability system for organisations that need clear proof of work and long-term impact records.</p>
            <div class="pricing-price-block">
              <span class="pricing-price-label">Lifetime price</span>
              <strong>KES 495,000</strong>
              <small>One-time payment for one organisation, project, or client installation.</small>
            </div>
            <p class="pricing-value-note">Built for community organisations, NGOs, environmental groups, church projects, school programmes, grant-funded projects, local initiatives, and field teams that need organised records and professional evidence of their work.</p>
            <div class="pricing-cta-row">
              <button type="button" class="primary-button pricing-scroll-button" data-pricing-scroll="cta">Get Lifetime Licence</button>
              <button type="button" class="secondary-button pricing-scroll-button" data-pricing-scroll="features">View Features</button>
            </div>
          </div>
          <div class="pricing-highlight-panel">
            <div class="pricing-badge-grid">
              <span class="status-badge">Lifetime licence</span>
              <span class="status-badge">White-label ready</span>
              <span class="status-badge">Offline-first</span>
              <span class="status-badge">Reporting ready</span>
            </div>
            <div class="pricing-metric-list">
              <div class="metric-item"><span>Product wording</span><strong>${escapeHtml(brand.productName)}</strong></div>
              <div class="metric-item"><span>Alternate wording</span><strong>${escapeHtml(brand.alternateProductName)}</strong></div>
              <div class="metric-item"><span>Licence scope</span><strong>One organisation, project, or client installation</strong></div>
              <div class="metric-item"><span>Price visibility</span><strong>KES 495,000</strong></div>
            </div>
          </div>
        </section>

        <section class="card pricing-section-block">
          <div class="section-heading"><h2>Why this price is fair</h2></div>
          <div class="pricing-two-column">
            <div class="helper-block">This is not a simple website or ordinary form system. It is a structured project documentation and evidence management system that helps organisations record projects, beneficiaries, locations, activities, images, files, evidence, and field records in one organised place.</div>
            <div class="helper-block">The lifetime price protects the client from repeated monthly software costs while still reflecting the real development depth, offline-first desktop packaging, linked dossier structure, reporting readiness, and long-term operational value of the system.</div>
          </div>
        </section>

        <section id="pricingFeaturesSection" class="card pricing-section-block">
          <div class="section-heading"><h2>Core feature value</h2></div>
          <div class="pricing-feature-grid">
            <article class="pricing-feature-card"><h3>Project records</h3><p>Track project titles, stages, timelines, donors, notes, attachments, and structured operational history in one dependable record.</p></article>
            <article class="pricing-feature-card"><h3>Beneficiary records</h3><p>Keep beneficiary, group, school, household, and institution records organised with linked history, contacts, and evidence.</p></article>
            <article class="pricing-feature-card"><h3>Location records</h3><p>Document counties, wards, villages, schools, communities, and field locations with mapped context and linked activity history.</p></article>
            <article class="pricing-feature-card"><h3>Activity records</h3><p>Store field visits, trainings, installations, planting work, follow-up events, and verification activities with structured evidence.</p></article>
            <article class="pricing-feature-card"><h3>Media and evidence support</h3><p>Attach images, documents, reference files, and proof materials to the exact project, beneficiary, location, or activity they support.</p></article>
            <article class="pricing-feature-card"><h3>Search and retrieval</h3><p>Find records faster across projects, people, places, evidence, dates, and operational history instead of relying on scattered folders.</p></article>
            <article class="pricing-feature-card"><h3>Future reporting readiness</h3><p>Designed for donor-ready summaries, partner reporting, review workflows, and future print or export improvements.</p></article>
            <article class="pricing-feature-card"><h3>White-label client branding readiness</h3><p>Can support future distribution to different organisations, clients, project teams, and social-impact brands.</p></article>
            <article class="pricing-feature-card"><h3>Organised long-term records</h3><p>Preserve long-term project memory with connected dossiers, linked evidence, and a clearer account of work done over time.</p></article>
          </div>
        </section>

        <section class="card pricing-section-block">
          <div class="section-heading"><h2>Lifetime licence includes</h2></div>
          <div class="pricing-include-grid">
            <div class="detail-card"><strong>Lifetime use</strong><span>Lifetime use of the purchased version for one organisation, project, or client installation.</span></div>
            <div class="detail-card"><strong>Records modules</strong><span>Project records, beneficiary records, location records, and activity records modules.</span></div>
            <div class="detail-card"><strong>Evidence support</strong><span>Image and media attachment support plus document and reference file attachment support.</span></div>
            <div class="detail-card"><strong>Documentation value</strong><span>Community impact documentation support and client branding readiness where supported.</span></div>
            <div class="detail-card"><strong>Supported version care</strong><span>Access to bug fixes for the supported version, where applicable.</span></div>
            <div class="detail-card"><strong>Licence support</strong><span>Licence activation support, where applicable.</span></div>
          </div>
        </section>

        <section class="card pricing-section-block">
          <div class="section-heading"><h2>What makes it different</h2></div>
          <div class="pricing-list-grid">
            <div class="linked-card"><h4>Practical field value</h4><div>Helps replace scattered files, WhatsApp images, handwritten notes, and loose spreadsheets.</div></div>
            <div class="linked-card"><h4>Proof of work</h4><div>Helps prove what work was done, where it happened, and who benefited.</div></div>
            <div class="linked-card"><h4>Review readiness</h4><div>Supports donor-ready documentation and makes field activity easier to review later.</div></div>
            <div class="linked-card"><h4>Long-term accountability</h4><div>Helps preserve long-term project and community impact history while strengthening accountability for community work.</div></div>
            <div class="linked-card"><h4>Structured records</h4><div>Gives each project, beneficiary, location, and activity its own organised record.</div></div>
            <div class="linked-card"><h4>Professional presentation</h4><div>Helps present work more professionally to partners, donors, officials, and community leaders.</div></div>
            <div class="linked-card"><h4>Adaptable distribution</h4><div>Can be adapted to different client brands and organisation types.</div></div>
          </div>
        </section>

        <section class="card pricing-section-block">
          <div class="section-heading"><h2>Best for</h2></div>
          <div class="pricing-badge-grid expanded">
            <span class="status-badge">Environmental organisations</span>
            <span class="status-badge">Community-based organisations</span>
            <span class="status-badge">County and community initiatives</span>
            <span class="status-badge">Grant-funded projects</span>
            <span class="status-badge">Water and spring protection groups</span>
            <span class="status-badge">Tree planting initiatives</span>
            <span class="status-badge">Youth groups</span>
            <span class="status-badge">Women groups</span>
            <span class="status-badge">Training programmes</span>
            <span class="status-badge">Field documentation teams</span>
            <span class="status-badge">Church projects</span>
            <span class="status-badge">School programmes</span>
            <span class="status-badge">Local development organisations</span>
            <span class="status-badge">Grassroots organisations</span>
            <span class="status-badge">Small foundations</span>
            <span class="status-badge">Social impact teams</span>
          </div>
        </section>

        <section class="card pricing-section-block">
          <div class="section-heading"><h2>Price justification</h2></div>
          <div class="pricing-two-column">
            <div class="helper-block">KES 495,000 is positioned as a serious but fair single lifetime licence price for this offline-first project documentation and impact management application. The price reflects the depth of project, beneficiary, location, map, activity, evidence, dossier, reporting, and installer work already built into the system.</div>
            <div class="pricing-metric-list">
              <div class="metric-item"><span>Lifetime price</span><strong>KES 495,000</strong></div>
              <div class="metric-item"><span>Equivalent over 3 years</span><strong>About KES 13,750 per month</strong></div>
              <div class="metric-item"><span>Equivalent over 5 years</span><strong>About KES 8,250 per month</strong></div>
            </div>
          </div>
        </section>

        <section id="pricingCtaSection" class="card pricing-cta-panel">
          <p class="eyebrow">Call to action</p>
          <h2>Own a Serious Project Documentation System Once</h2>
          <p>Stop depending on scattered folders, manual notes, missing field images, and unorganised project records. This system gives your organisation a professional way to document projects, beneficiaries, locations, activities, evidence, and long-term impact.</p>
          <div class="pricing-cta-row">
            <button type="button" class="primary-button pricing-print-button">Get Lifetime Licence — KES 495,000</button>
            <button type="button" class="secondary-button pricing-scroll-button" data-pricing-scroll="faq">View FAQ</button>
          </div>
        </section>

        <section id="pricingFaqSection" class="card pricing-section-block">
          <div class="section-heading"><h2>Frequently asked questions</h2></div>
          <div class="pricing-faq-grid">
            <article class="pricing-faq-item"><h3>Is this a monthly subscription?</h3><p>No. The lifetime licence is a one-time payment for lifetime use of the purchased version for one organisation, project, or client installation.</p></article>
            <article class="pricing-faq-item"><h3>What is this application for?</h3><p>It is for documenting projects, beneficiaries, locations, activities, evidence, images, files, and long-term impact records.</p></article>
            <article class="pricing-faq-item"><h3>Can it store project evidence?</h3><p>Yes. The system is designed to attach images, documents, references, and evidence files to the relevant records.</p></article>
            <article class="pricing-faq-item"><h3>Can the organised records support reporting?</h3><p>Yes. The organised records can support donor updates, partner presentations, project reviews, and accountability reports.</p></article>
            <article class="pricing-faq-item"><h3>Is it only for one organisation?</h3><p>No. This pricing page is suitable for future distribution to different clients and organisation types.</p></article>
            <article class="pricing-faq-item"><h3>Can the app be branded for different clients?</h3><p>Where the app supports configurable branding, it can use the client’s own organisation name, logo, colours, and identity.</p></article>
            <article class="pricing-faq-item"><h3>Does it support beneficiaries?</h3><p>Yes. Beneficiaries can be recorded with their own profiles, documents, images, and related project history.</p></article>
          </div>
        </section>
      </div>
    `;

    target.querySelectorAll('[data-pricing-scroll]').forEach((button) => {
      button.addEventListener('click', () => {
        const targetId = button.dataset.pricingScroll === 'faq'
          ? 'pricingFaqSection'
          : button.dataset.pricingScroll === 'cta'
            ? 'pricingCtaSection'
            : 'pricingFeaturesSection';
        byId(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
    target.querySelectorAll('.pricing-print-button').forEach((button) => {
      button.addEventListener('click', async () => {
        try {
          await printCurrentSection();
          showNotification('Pricing proposal prepared for print or PDF saving.', false);
        } catch (error) {
          showNotification(error.message, true);
        }
      });
    });
  }

  function renderCopyright() {
    const target = byId('copyrightPageContent');
    if (!target) {
      return;
    }
    target.innerHTML = `
      <div class="copyright-shell">
        <section class="copyright-hero card">
          <div class="copyright-hero-copy">
            <p class="eyebrow">Copyright, Distribution Advisory &amp; Usage Limitations</p>
            <h2>Copyright, Distribution Advisory &amp; Usage Limitations</h2>
            <p class="copyright-lead">Important information about software ownership, permitted use, distribution limits, client responsibilities, third-party components, and acceptable use of this application.</p>
            <div class="helper-block">This page provides a plain-language advisory summary for clients, organisations, and authorised users. It explains how the Software may be used, what is restricted, and what responsibilities remain with the Licence Holder. It is not a substitute for a signed software licence agreement or professional legal advice.</div>
            <div class="pricing-cta-row">
              <button type="button" class="primary-button copyright-scroll-button" data-copyright-scroll="rights">View usage rights</button>
              <button type="button" class="secondary-button copyright-scroll-button" data-copyright-scroll="faq">View FAQ</button>
            </div>
          </div>
          <div class="copyright-highlight-panel">
            <div class="pricing-badge-grid">
              <span class="status-badge">Licensed, not sold</span>
              <span class="status-badge">Plain-language advisory</span>
              <span class="status-badge">White-label suitable</span>
              <span class="status-badge">Distribution limits apply</span>
            </div>
            <div class="pricing-metric-list">
              <div class="metric-item"><span>Ownership position</span><strong>The Developer retains protected rights</strong></div>
              <div class="metric-item"><span>Standard use scope</span><strong>One approved organisation, project, installation, or client deployment</strong></div>
              <div class="metric-item"><span>Redistribution status</span><strong>Separate written permission required</strong></div>
              <div class="metric-item"><span>Advisory status</span><strong>Summary notice, not a final legal contract</strong></div>
            </div>
          </div>
        </section>

        <section class="card copyright-section-block">
          <div class="section-heading"><h2>Software ownership notice</h2></div>
          <div class="copyright-two-column">
            <div class="helper-block">The Application, source code, design structure, layouts, user interface logic, database structure, workflows, documentation, branding framework, and custom implementation remain protected by copyright and other applicable intellectual property rights.</div>
            <div class="helper-block">A client licence allows authorised use of the Software; it does not automatically transfer ownership of the source code or intellectual property. Unless a separate written agreement states otherwise, any transfer of ownership, resale rights, white-label resale rights, source-code ownership, or sublicensing rights must be granted separately in writing.</div>
          </div>
        </section>

        <section id="copyrightRightsSection" class="card copyright-section-block">
          <div class="section-heading"><h2>Licence-based use</h2></div>
          <div class="copyright-card-grid">
            <article class="pricing-feature-card"><h3>Authorised use basis</h3><p>The Software is provided under a licence for authorised use. One licence applies to one approved organisation, project, installation, or client deployment, unless otherwise agreed in writing.</p></article>
            <article class="pricing-feature-card"><h3>Operational use</h3><p>The Licence Holder may use the Software for internal project documentation, beneficiary records, activity tracking, location records, evidence management, media storage, document records, impact history, and related operational purposes.</p></article>
            <article class="pricing-feature-card"><h3>Not a resale licence</h3><p>The licence does not allow the Licence Holder to sell, rent, lease, sublicense, clone, repackage, upload for public download, or redistribute the Application as their own software product.</p></article>
            <article class="pricing-feature-card"><h3>Protected access assets</h3><p>The licence does not permit sharing activation keys, private access links, installation files, database copies, or protected source files with unauthorised third parties.</p></article>
          </div>
        </section>

        <section class="card copyright-section-block">
          <div class="section-heading"><h2>Permitted use</h2></div>
          <div class="copyright-list-grid">
            <div class="linked-card"><h4>Internal project records</h4><div>Using the Application for internal project records, programme management, and operational documentation.</div></div>
            <div class="linked-card"><h4>Beneficiary and community records</h4><div>Maintaining beneficiary, household, group, school, institution, and community records where the Software supports those workflows.</div></div>
            <div class="linked-card"><h4>Evidence and documentation</h4><div>Attaching evidence files, images, reference documents, and activity records for legitimate organisational use.</div></div>
            <div class="linked-card"><h4>Configured branding</h4><div>Using configurable branding options where the Application supports them, without claiming ownership of the underlying Software.</div></div>
          </div>
        </section>

        <section class="card copyright-section-block">
          <div class="section-heading"><h2>Restricted and prohibited actions</h2></div>
          <div class="copyright-warning-grid">
            <div class="detail-card"><strong>No unauthorised redistribution</strong><span>Do not copy, redistribute, re-upload, mirror, or circulate the Application or protected installation materials without written permission.</span></div>
            <div class="detail-card"><strong>No resale or sublicensing</strong><span>Do not resell, rent, lease, sublicense, or present the Software as your own distributable product under a standard client licence.</span></div>
            <div class="detail-card"><strong>No cloning or repackaging</strong><span>Do not clone, repackage, or create disguised derivative distributions for third-party deployment without a separate written agreement.</span></div>
            <div class="detail-card"><strong>No tampering with controls</strong><span>Do not remove branding controls, licence checks, protected notices, or ownership notices unless a separate written agreement permits it.</span></div>
            <div class="detail-card"><strong>No unauthorised reverse engineering</strong><span>Do not reverse engineer, decompile, or extract protected logic beyond what applicable law expressly allows.</span></div>
            <div class="detail-card"><strong>No key or database sharing</strong><span>Do not share activation materials, protected files, or deployment copies with unauthorised users, branches, partners, or agencies.</span></div>
          </div>
        </section>

        <section class="card copyright-section-block">
          <div class="section-heading"><h2>Client responsibilities</h2></div>
          <div class="copyright-two-column">
            <div class="helper-block">The Organisation remains responsible for lawful data collection, consent, privacy handling, accuracy of records, staff access control, beneficiary image use, and responsible use of uploaded files and project evidence.</div>
            <div class="helper-block">The Client should maintain regular backups of important data and should not rely on the Application alone as proof of legal compliance, factual verification, or independent audit confirmation.</div>
          </div>
        </section>

        <section class="card copyright-section-block">
          <div class="section-heading"><h2>Third-party components and licence boundaries</h2></div>
          <div class="copyright-card-grid">
            <article class="pricing-feature-card"><h3>Third-party libraries</h3><p>The Software may use third-party components, and those components remain subject to their own licences, notices, and compliance obligations.</p></article>
            <article class="pricing-feature-card"><h3>Open-source caution</h3><p>Open-source dependencies may carry notice, attribution, source-availability, or redistribution obligations depending on their licence terms.</p></article>
            <article class="pricing-feature-card"><h3>No Creative Commons for code</h3><p>This advisory page does not suggest Creative Commons licensing for the Software code itself. Proper software licences should be used for software code and distribution rights.</p></article>
            <article class="pricing-feature-card"><h3>GPL-sensitive distribution</h3><p>If GPL or similar dependencies are ever distributed with the Software, recipients may need access to corresponding source code or equivalent freedoms as required by those licences.</p></article>
          </div>
        </section>

        <section class="card copyright-section-block">
          <div class="section-heading"><h2>Support, warranty, and data boundaries</h2></div>
          <div class="copyright-list-grid">
            <div class="linked-card"><h4>Support boundary</h4><div>Support applies only to what has been agreed. It does not automatically include hosting, hardware, internet, domains, third-party APIs, or external integrations unless agreed separately.</div></div>
            <div class="linked-card"><h4>Data boundary</h4><div>The Developer is not responsible for data loss caused by deleted files, device failure, unauthorised access, poor backups, user mistakes, malware, hosting failure, or third-party platform problems.</div></div>
            <div class="linked-card"><h4>Verification boundary</h4><div>The Application organises records and evidence, but the Organisation remains responsible for the truthfulness, legality, and quality of the information entered.</div></div>
            <div class="linked-card"><h4>Advisory boundary</h4><div>This page is a plain-language advisory and should not be treated as a lawyer-drafted agreement or formal legal opinion.</div></div>
          </div>
        </section>

        <section class="card copyright-section-block">
          <div class="section-heading"><h2>White-label and custom branding advisory</h2></div>
          <div class="copyright-two-column">
            <div class="helper-block">The Application may support client branding where configurable branding exists. Client branding does not transfer copyright ownership of the underlying Software.</div>
            <div class="helper-block">Removing developer ownership notices, licence controls, or protected copyright notices is not allowed unless a separate written white-label or source-code agreement permits it. White-label resale, agency use, or rebranding for sale to third parties requires a separate licence.</div>
          </div>
        </section>

        <section class="card copyright-alert-panel">
          <p class="eyebrow">Enforcement and licence termination advisory</p>
          <h2>Misuse can affect licence standing</h2>
          <p>Unauthorised redistribution, licence sharing, tampering, resale, or source-code misuse may lead to licence suspension or termination where permitted by the licence agreement. The Developer may disable unauthorised installations, refuse support, or take lawful steps to protect the Software where misuse is detected. The Client should request written permission before any unusual deployment, resale, network roll-out, or third-party transfer.</p>
        </section>

        <section class="card copyright-section-block">
          <div class="section-heading"><h2>Practical buyer checklist</h2></div>
          <div class="copyright-checklist">
            <div class="detail-card"><strong>Before buying, installing, or distributing this Software, confirm:</strong><span>The licence type matches the intended use.</span></div>
            <div class="detail-card"><strong>Deployment scope</strong><span>The number of organisations, branches, users, or deployments is covered.</span></div>
            <div class="detail-card"><strong>Branding scope</strong><span>Branding or white-label needs are agreed in writing.</span></div>
            <div class="detail-card"><strong>Distribution rights</strong><span>Distribution or resale rights are clearly granted if needed.</span></div>
            <div class="detail-card"><strong>Data responsibility</strong><span>Data protection responsibilities are understood and backups will be maintained.</span></div>
            <div class="detail-card"><strong>Operational readiness</strong><span>Staff know how to handle beneficiary and project records responsibly, and unsupported features are not presented as completed.</span></div>
            <div class="detail-card"><strong>Content rights</strong><span>Third-party media, images, documents, and uploads are authorised for use.</span></div>
            <div class="detail-card"><strong>Compliance review</strong><span>Any legal or compliance questions are reviewed by a qualified adviser.</span></div>
          </div>
        </section>

        <section id="copyrightFaqSection" class="card copyright-section-block">
          <div class="section-heading"><h2>Frequently asked questions</h2></div>
          <div class="pricing-faq-grid">
            <article class="pricing-faq-item"><h3>Does buying a licence mean I own the source code?</h3><p>No. Unless a separate written agreement states otherwise, buying a licence gives authorised use of the Software but does not transfer source-code ownership or intellectual property rights.</p></article>
            <article class="pricing-faq-item"><h3>Can I resell the Application to another organisation?</h3><p>Not under a normal client licence. Resale, redistribution, white-label resale, agency distribution, or sublicensing requires separate written permission.</p></article>
            <article class="pricing-faq-item"><h3>Can I use the Software for more than one organisation?</h3><p>Only if the licence expressly allows it. One standard licence should normally apply to one approved organisation, project, installation, or client deployment.</p></article>
            <article class="pricing-faq-item"><h3>Can I remove the Developer notice?</h3><p>Not unless the licence or a separate written agreement permits it.</p></article>
            <article class="pricing-faq-item"><h3>Can I customise branding?</h3><p>Yes, where the Application supports configurable branding. Custom branding does not transfer ownership of the underlying Software.</p></article>
            <article class="pricing-faq-item"><h3>Can I upload beneficiary images and documents?</h3><p>Yes, where supported, but the Organisation is responsible for consent, privacy, accuracy, and lawful use of uploaded content.</p></article>
            <article class="pricing-faq-item"><h3>Does the Software verify uploaded records?</h3><p>No. The Software organises records, but the Organisation remains responsible for the accuracy and truthfulness of the information entered.</p></article>
            <article class="pricing-faq-item"><h3>Does this page replace a legal agreement?</h3><p>No. This page is an advisory summary and should not replace a signed licence agreement, terms of service, privacy policy, or professional legal advice.</p></article>
            <article class="pricing-faq-item"><h3>Are third-party libraries included?</h3><p>The Software may use third-party components, and those components remain subject to their own licences and notices.</p></article>
            <article class="pricing-faq-item"><h3>Can I distribute the Software to branches or partners?</h3><p>Branch, partner, network, reseller, government, school, NGO, or franchise distribution may require a separate written licence.</p></article>
          </div>
        </section>

        <section id="copyrightCtaSection" class="card copyright-cta-panel">
          <p class="eyebrow">Distribution permissions</p>
          <h2>Need wider distribution or white-label rights?</h2>
          <p>Standard licences are intended for authorised use by one approved organisation, project, installation, or client deployment. Wider distribution, resale, network roll-out, agency use, or full white-label rights should be agreed separately in writing before deployment.</p>
          <div class="pricing-cta-row">
            <button type="button" class="primary-button copyright-print-button">Request Distribution Permission</button>
            <button type="button" class="secondary-button copyright-scroll-button" data-copyright-scroll="faq">View FAQ</button>
          </div>
        </section>
      </div>
    `;

    target.querySelectorAll('[data-copyright-scroll]').forEach((button) => {
      button.addEventListener('click', () => {
        const targetId = button.dataset.copyrightScroll === 'faq'
          ? 'copyrightFaqSection'
          : 'copyrightRightsSection';
        byId(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
    target.querySelectorAll('.copyright-print-button').forEach((button) => {
      button.addEventListener('click', async () => {
        try {
          await printCurrentSection();
          showNotification('Copyright advisory prepared for print or PDF saving.', false);
        } catch (error) {
          showNotification(error.message, true);
        }
      });
    });
  }

  function showNotification(message, isError) {
    const node = byId('notification');
    node.textContent = message;
    node.className = `notification ${isError ? 'error' : ''}`.trim();
    node.classList.remove('hidden');
    window.clearTimeout(node._timeoutId);
    node._timeoutId = window.setTimeout(() => node.classList.add('hidden'), 3500);
  }

  function showDesktopLaunchState() {
    byId('desktopLaunchPanel').classList.remove('hidden');
    byId('loginForm').classList.add('hidden');
    byId('initialAdminForm').classList.add('hidden');
    byId('defaultCredentials').textContent = 'Available after launching the desktop app';
  }

  function getFormField(form, name) {
    return form.elements.namedItem(name);
  }

  function getRepeatableUploadGroup(form, fieldName) {
    return form ? form.querySelector(`[data-repeatable-upload-field="${fieldName}"]`) : null;
  }

  function getRepeatableUploadInputs(form, fieldName) {
    if (!form) {
      return [];
    }
    const group = getRepeatableUploadGroup(form, fieldName);
    if (group) {
      return Array.from(group.querySelectorAll(`input[type="file"][name="${fieldName}"], input[type="file"][data-upload-field="${fieldName}"]`));
    }
    const input = getFormField(form, fieldName);
    return input ? [input] : [];
  }

  function getSelectedUploadFiles(form, fieldName) {
    return getRepeatableUploadInputs(form, fieldName)
      .flatMap((input) => Array.from(input.files || []))
      .filter((file) => file && file.path);
  }

  function syncRepeatableUploadRowState(group) {
    if (!group) {
      return;
    }
    const rows = Array.from(group.querySelectorAll('[data-repeatable-upload-row]'));
    rows.forEach((row) => {
      const removeButton = row.querySelector('[data-repeatable-upload-remove]');
      if (!removeButton) {
        return;
      }
      const shouldHide = rows.length === 1;
      removeButton.disabled = shouldHide;
      removeButton.classList.toggle('hidden', shouldHide);
    });
  }

  function setRepeatableUploadFieldMode(form, fieldName, options = {}) {
    const group = getRepeatableUploadGroup(form, fieldName);
    if (!group) {
      return;
    }
    if (!options.allowAdditionalRows) {
      const rows = Array.from(group.querySelectorAll('[data-repeatable-upload-row]'));
      rows.slice(1).forEach((row) => row.remove());
    }
    const addButton = group.querySelector('[data-repeatable-upload-add]');
    if (addButton) {
      addButton.classList.toggle('hidden', !options.allowAdditionalRows);
    }
    getRepeatableUploadInputs(form, fieldName).forEach((input) => {
      if (options.allowMultiplePerInput) {
        input.multiple = true;
      } else {
        input.removeAttribute('multiple');
      }
    });
    syncRepeatableUploadRowState(group);
  }

  function setupRepeatableUploadField(config) {
    const form = byId(config.formId);
    if (!form || getRepeatableUploadGroup(form, config.fieldName)) {
      return;
    }
    const sourceInput = getFormField(form, config.fieldName);
    if (!sourceInput || sourceInput.type !== 'file') {
      return;
    }
    const sourceLabel = sourceInput.closest('label');
    if (!sourceLabel || !sourceLabel.parentNode) {
      return;
    }

    const parent = sourceLabel.parentNode;
    const group = document.createElement('div');
    group.className = 'full-span repeatable-upload-group';
    group.setAttribute('data-repeatable-upload-field', config.fieldName);

    const rowsTarget = document.createElement('div');
    rowsTarget.className = 'repeatable-upload-rows';
    rowsTarget.setAttribute('data-repeatable-upload-rows', '');

    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.className = 'secondary-button repeatable-upload-add';
    addButton.textContent = 'Add another upload';
    addButton.setAttribute('data-repeatable-upload-add', '');

    const triggerSync = () => {
      if (config.syncQueue) {
        renderPhotoUploadQueue(getSelectedUploadFiles(form, config.fieldName));
      }
    };

    function createRow(labelNode, isClone = false) {
      const row = document.createElement('div');
      row.className = 'repeatable-upload-row';
      row.setAttribute('data-repeatable-upload-row', '');
      const label = isClone ? labelNode.cloneNode(true) : labelNode;
      label.classList.add('repeatable-upload-label');
      const input = label.querySelector('input[type="file"]');
      if (input) {
        input.value = '';
        if (isClone) {
          input.dataset.uploadField = config.fieldName;
          input.removeAttribute('name');
        }
        if (config.allowMultiplePerInput) {
          input.multiple = true;
        } else {
          input.removeAttribute('multiple');
        }
        input.addEventListener('change', () => triggerSync());
      }

      const actions = document.createElement('div');
      actions.className = 'repeatable-upload-actions';
      const removeButton = document.createElement('button');
      removeButton.type = 'button';
      removeButton.className = 'inline-button';
      removeButton.textContent = 'Remove';
      removeButton.setAttribute('data-repeatable-upload-remove', '');
      removeButton.addEventListener('click', () => {
        if (rowsTarget.querySelectorAll('[data-repeatable-upload-row]').length === 1) {
          return;
        }
        row.remove();
        syncRepeatableUploadRowState(group);
        triggerSync();
      });
      actions.appendChild(removeButton);

      row.appendChild(label);
      row.appendChild(actions);
      return row;
    }

    const templateLabel = sourceLabel.cloneNode(true);
    parent.insertBefore(group, sourceLabel);
    rowsTarget.appendChild(createRow(sourceLabel));
    group.appendChild(rowsTarget);
    group.appendChild(addButton);

    addButton.addEventListener('click', () => {
      rowsTarget.appendChild(createRow(templateLabel, true));
      syncRepeatableUploadRowState(group);
      triggerSync();
    });

    syncRepeatableUploadRowState(group);
    triggerSync();
  }

  function setupRepeatableUploadFields() {
    REPEATABLE_UPLOAD_FIELDS.forEach((config) => setupRepeatableUploadField(config));
  }

  function getMultipleSelectValues(selectNode) {
    return Array.from(selectNode.selectedOptions).map((option) => Number(option.value)).filter((value) => value);
  }

  function setMultipleSelectValues(selectNode, values) {
    const set = new Set((values || []).map((value) => String(value)));
    Array.from(selectNode.options).forEach((option) => {
      option.selected = set.has(option.value);
    });
  }

  function createOption(value, label) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    return option;
  }

  function fillSelect(selectNode, options, blankLabel) {
    selectNode.innerHTML = '';
    if (blankLabel !== undefined) {
      selectNode.appendChild(createOption('', blankLabel));
    }
    options.forEach((option) => {
      if (typeof option === 'string') {
        selectNode.appendChild(createOption(option, humanise(option)));
      } else {
        selectNode.appendChild(createOption(String(option.value), option.label));
      }
    });
  }

  function fillMultiSelect(selectNode, options) {
    selectNode.innerHTML = '';
    options.forEach((option) => {
      selectNode.appendChild(createOption(String(option.value), option.label));
    });
  }

  function parseJsonField(value, fallback) {
    const text = String(value || '').trim();
    if (!text) {
      return fallback;
    }
    return JSON.parse(text);
  }

  function parseJsonFieldSafe(value, fallback) {
    try {
      return parseJsonField(value, fallback);
    } catch (_error) {
      return fallback;
    }
  }

  function getCustomFieldFormConfig(entityType) {
    return CUSTOM_FIELD_FORM_CONFIG[entityType] || null;
  }

  function getCustomFieldInsertOptions(entityType) {
    if (entityType === 'project') {
      return PROJECT_CUSTOM_FIELD_INSERT_OPTIONS;
    }
    return GENERIC_CUSTOM_FIELD_INSERT_OPTIONS[entityType] || [];
  }

  function getFormCustomData(entityType) {
    const config = getCustomFieldFormConfig(entityType);
    if (!config) {
      return {};
    }
    const form = byId(config.formId);
    if (!form) {
      return {};
    }
    const field = getFormField(form, config.dataFieldName);
    return parseJsonFieldSafe(field && field.value ? field.value : '{}', {});
  }

  function setFormCustomData(entityType, data) {
    const config = getCustomFieldFormConfig(entityType);
    if (!config) {
      return;
    }
    const form = byId(config.formId);
    if (!form) {
      return;
    }
    const field = getFormField(form, config.dataFieldName);
    if (!field) {
      return;
    }
    field.value = JSON.stringify(data || {}, null, config.dataFieldName === 'customData' ? 2 : 0);
  }

  async function callApi(method, payload) {
    const result = await window.environmentApp[method](payload);
    if (!result.ok) {
      throw new Error(result.error);
    }
    return result.data;
  }

  async function performAction(action, successMessage) {
    try {
      const result = await action();
      if (result && result.ok === false) {
        throw new Error(result.error || 'Operation failed.');
      }
      await refreshBootstrap();
      if (successMessage) {
        showNotification(successMessage, false);
      }
    } catch (error) {
      showNotification(error.message, true);
    }
  }

  function getBootstrapArray(key) {
    return state.bootstrap && Array.isArray(state.bootstrap[key]) ? state.bootstrap[key] : [];
  }

  function getProjectById(id) {
    return getBootstrapArray('projects').find((item) => item.id === id) || null;
  }

  function getBeneficiaryById(id) {
    return getBootstrapArray('beneficiaries').find((item) => item.id === id) || null;
  }

  function getLocationById(id) {
    return getBootstrapArray('locations').find((item) => item.id === id) || null;
  }

  function getActivityById(id) {
    return getBootstrapArray('activities').find((item) => item.id === id) || null;
  }

  function getDutyById(id) {
    return getBootstrapArray('duties').find((item) => item.id === id) || null;
  }

  function todayIsoDate() {
    return new Date().toISOString().slice(0, 10);
  }

  function buildActivitySavePayload(activity, overrides = {}) {
    return {
      id: activity.id,
      title: activity.title,
      activityType: activity.activityType,
      activityDate: activity.activityDate || '',
      status: activity.status || 'planned',
      projectId: activity.projectId || null,
      beneficiaryId: activity.beneficiaryId || null,
      locationId: activity.locationId || null,
      categoryId: activity.categoryId || null,
      metricsJson: activity.metricsJson || {},
      followUpStatus: activity.followUpStatus || '',
      notes: activity.notes || '',
      tags: activity.tags || '',
      customData: activity.customData || {},
      ...overrides
    };
  }

  function buildDutySavePayload(duty, overrides = {}) {
    return {
      id: duty.id,
      title: duty.title,
      dutyType: duty.dutyType,
      assignedUserId: duty.assignedUserId || null,
      assignedBeneficiaryId: duty.assignedBeneficiaryId || null,
      projectId: duty.projectId || null,
      locationId: duty.locationId || null,
      assignedDate: duty.assignedDate || '',
      dueDate: duty.dueDate || '',
      status: duty.status || 'planned',
      priority: duty.priority || 'normal',
      notes: duty.notes || '',
      tags: duty.tags || '',
      customData: duty.customData || {},
      ...overrides
    };
  }

  async function quickUpdateProjectStatus(projectId, status) {
    const project = getProjectById(projectId);
    if (!project) {
      throw new Error('Project was not found.');
    }
    const payload = buildProjectSavePayload(project, project.distributedItems || []);
    payload.status = status;
    if (status === 'completed' && !payload.dateCompleted) {
      payload.dateCompleted = todayIsoDate();
    }
    await performAction(() => callApi('saveProject', payload), `Project marked ${humanise(status)}.`);
  }

  async function quickUpdateActivityStatus(activityId, status) {
    const activity = getActivityById(activityId);
    if (!activity) {
      throw new Error('Activity was not found.');
    }
    await performAction(() => callApi('saveActivity', buildActivitySavePayload(activity, { status })), `Activity marked ${humanise(status)}.`);
  }

  async function quickUpdateDutyStatus(dutyId, status) {
    const duty = getDutyById(dutyId);
    if (!duty) {
      throw new Error('Duty was not found.');
    }
    await performAction(() => callApi('saveDuty', buildDutySavePayload(duty, { status })), `Duty marked ${humanise(status)}.`);
  }

  function getDocumentById(id) {
    return getBootstrapArray('documents').find((item) => item.id === id) || null;
  }

  function getExcelImportById(id) {
    return getBootstrapArray('excelImports').find((item) => item.id === id) || null;
  }

  function getEntryById(id) {
    return getBootstrapArray('extractedEntries').find((item) => item.id === id) || null;
  }

  function getPhotoById(id) {
    return getBootstrapArray('photos').find((item) => item.id === id) || null;
  }

  function getMapById(id) {
    return getBootstrapArray('maps').find((item) => item.id === id) || null;
  }

  function getTimelineById(id) {
    return getBootstrapArray('timelineEntries').find((item) => item.id === id) || null;
  }

  function getReportById(id) {
    return getBootstrapArray('reports').find((item) => item.id === id) || null;
  }

  function getCategoryById(categoryId) {
    return getBootstrapArray('categories').find((item) => item.id === Number(categoryId)) || null;
  }

  function getUserById(id) {
    return getBootstrapArray('users').find((item) => item.id === Number(id)) || null;
  }

  function getCustomFieldById(customFieldId) {
    return getBootstrapArray('customFields').find((item) => item.id === Number(customFieldId)) || null;
  }

  function getProjectCategoryProfile(categoryId) {
    const category = getCategoryById(categoryId);
    return category ? ENVIRONMENT_SCHEMA_REGISTRY.categories[category.name]?.projectProfile || null : null;
  }

  function getDistributionProfileByCategoryId(categoryId) {
    const category = getCategoryById(categoryId);
    return category ? ENVIRONMENT_SCHEMA_REGISTRY.categories[category.name]?.distributionProfile || null : null;
  }

  function getCategorySchema(categoryId) {
    const category = getCategoryById(categoryId);
    return category ? ENVIRONMENT_SCHEMA_REGISTRY.categories[category.name] || null : null;
  }

  function getPreferredEntryTargetByCategory(categoryId) {
    return getCategorySchema(categoryId)?.preferredEntryTarget || '';
  }

  function getPreferredActivityTypeByCategory(categoryId) {
    return getCategorySchema(categoryId)?.preferredActivityType || '';
  }

  function getDistributedItemsRowsId(ownerType) {
    return `${ownerType}DistributedItemsRows`;
  }

  function getDistributedItemsHelperId(ownerType) {
    return `${ownerType}DistributedItemsHelper`;
  }

  function getDistributedItemTypeListId(ownerType) {
    return `${ownerType}DistributedItemTypeSuggestions`;
  }

  function getEntityOptions(entityType) {
    if (entityType === 'project') {
      return getBootstrapArray('projects').map((item) => ({ value: item.id, label: item.title }));
    }
    if (entityType === 'beneficiary') {
      return getBootstrapArray('beneficiaries').map((item) => ({ value: item.id, label: item.name }));
    }
    return getBootstrapArray('locations').map((item) => ({ value: item.id, label: item.name }));
  }

  function renderSelectOptions(options, selectedValue, blankLabel) {
    const selected = String(selectedValue || '');
    const rendered = [];
    if (blankLabel !== undefined) {
      rendered.push(`<option value="">${escapeHtml(blankLabel)}</option>`);
    }
    (options || []).forEach((option) => {
      rendered.push(`<option value="${escapeHtml(option.value)}" ${selected === String(option.value) ? 'selected' : ''}>${escapeHtml(option.label)}</option>`);
    });
    return rendered.join('');
  }

  function getDistributedItemLinkDefinitions(ownerType) {
    if (ownerType === 'project') {
      return [
        { key: 'relatedBeneficiaryId', label: 'Linked beneficiary', entityType: 'beneficiary' },
        { key: 'relatedLocationId', label: 'Linked location', entityType: 'location' }
      ];
    }
    if (ownerType === 'beneficiary') {
      return [
        { key: 'relatedProjectId', label: 'Linked project', entityType: 'project' },
        { key: 'relatedLocationId', label: 'Linked location', entityType: 'location' }
      ];
    }
    return [
      { key: 'relatedProjectId', label: 'Linked project', entityType: 'project' },
      { key: 'relatedBeneficiaryId', label: 'Linked beneficiary', entityType: 'beneficiary' }
    ];
  }

  function renderDistributedItemRow(ownerType, item = {}, index = 0) {
    const linkDefinitions = getDistributedItemLinkDefinitions(ownerType);
    const rowTitle = item.itemType || `Distribution row ${index + 1}`;
    return `
      <div class="distribution-item-row" data-distributed-item-row>
        <div class="distribution-item-row-header">
          <div>
            <div class="distribution-item-row-title">${escapeHtml(rowTitle)}</div>
            <div class="distribution-item-meta">Each row stays attached to this ${escapeHtml(ownerType)} record and can also point to the related linked records.</div>
          </div>
          <button type="button" class="secondary-button distribution-item-remove" data-distributed-item-remove>Remove row</button>
        </div>
        <label><span>Item type</span><input type="text" data-field="itemType" list="${escapeHtml(getDistributedItemTypeListId(ownerType))}" value="${escapeHtml(item.itemType || '')}" placeholder="e.g. Avocado seedlings"></label>
        <label><span>Subtype/variant</span><input type="text" data-field="itemSubtype" value="${escapeHtml(item.itemSubtype || '')}" placeholder="e.g. Hass grafted"></label>
        <label><span>Unit label</span><input type="text" data-field="unitLabel" value="${escapeHtml(item.unitLabel || '')}" placeholder="e.g. seedlings"></label>
        <label><span>Status</span><input type="text" data-field="status" value="${escapeHtml(item.status || '')}" placeholder="e.g. issued, verified"></label>
        <label><span>How many distributed</span><input type="number" min="0" step="0.01" data-field="quantityDistributed" value="${escapeHtml(item.quantityDistributed ?? '')}"></label>
        <label><span>Destroyed/lost</span><input type="number" min="0" step="0.01" data-field="quantityDestroyed" value="${escapeHtml(item.quantityDestroyed ?? '')}"></label>
        <label><span>Survived/active</span><input type="number" min="0" step="0.01" data-field="quantitySurvived" value="${escapeHtml(item.quantitySurvived ?? '')}"></label>
        <label><span>Returned</span><input type="number" min="0" step="0.01" data-field="quantityReturned" value="${escapeHtml(item.quantityReturned ?? '')}"></label>
        <label><span>Replaced</span><input type="number" min="0" step="0.01" data-field="quantityReplaced" value="${escapeHtml(item.quantityReplaced ?? '')}"></label>
        <label><span>Distribution date</span><input type="date" data-field="distributionDate" value="${escapeHtml(item.distributionDate || '')}"></label>
        ${linkDefinitions.map((definition) => `
          <label><span>${escapeHtml(definition.label)}</span><select data-field="${escapeHtml(definition.key)}">${renderSelectOptions(getEntityOptions(definition.entityType), item[definition.key], `No ${definition.entityType} link`)}</select></label>
        `).join('')}
        <label class="full-span"><span>Distribution notes</span><textarea rows="2" data-field="notes" placeholder="Record who received the item, condition, follow-up, or loss explanation.">${escapeHtml(item.notes || '')}</textarea></label>
      </div>
    `;
  }

  function getDistributedItemsHelperText(ownerType) {
    if (ownerType === 'project') {
      const profile = getDistributionProfileByCategoryId(byId('projectCategorySelect')?.value || '');
      if (profile) {
        return `<strong>Category-aware distribution capture</strong><br>${escapeHtml(profile.helper)}`;
      }
      return 'Add structured distribution rows that belong to this project and optionally link each row to a beneficiary and location.';
    }
    if (ownerType === 'beneficiary') {
      return 'Capture items received, distributed, damaged, or surviving for this beneficiary and optionally tie each row to a project and location.';
    }
    return 'Track items, materials, or assets connected to this location and optionally tie each row to a project and beneficiary.';
  }

  function renderDistributedItemsPanel(ownerType, items = []) {
    const helper = byId(getDistributedItemsHelperId(ownerType));
    const target = byId(getDistributedItemsRowsId(ownerType));
    if (!target) {
      return;
    }
    if (helper) {
      helper.innerHTML = getDistributedItemsHelperText(ownerType);
    }
    const rows = Array.isArray(items) && items.length ? items : [{}];
    const profile = ownerType === 'project' ? getDistributionProfileByCategoryId(byId('projectCategorySelect')?.value || '') : null;
    const suggestions = profile && Array.isArray(profile.itemTypeSuggestions) ? profile.itemTypeSuggestions : ['Seedlings', 'Water tank', 'Cookstove', 'Biogas unit', 'Fingerlings'];
    target.innerHTML = `
      <datalist id="${escapeHtml(getDistributedItemTypeListId(ownerType))}">
        ${suggestions.map((item) => `<option value="${escapeHtml(item)}"></option>`).join('')}
      </datalist>
      ${rows.map((item, index) => renderDistributedItemRow(ownerType, item, index)).join('')}
    `;
    target.querySelectorAll('[data-distributed-item-remove]').forEach((button) => {
      button.addEventListener('click', () => {
        const row = button.closest('[data-distributed-item-row]');
        if (!row) {
          return;
        }
        const otherRows = target.querySelectorAll('[data-distributed-item-row]');
        if (otherRows.length === 1) {
          renderDistributedItemsPanel(ownerType, [{}]);
          return;
        }
        row.remove();
        renderFormIntelligence(ownerType);
      });
    });
    if (['project', 'beneficiary', 'location'].includes(ownerType)) {
      renderFormIntelligence(ownerType);
    }
  }

  function appendDistributedItemRow(ownerType, item = {}) {
    const currentItems = collectDistributedItems(ownerType, true);
    currentItems.push(item);
    renderDistributedItemsPanel(ownerType, currentItems);
  }

  function collectDistributedItems(ownerType, includeEmptyRows = false) {
    const target = byId(getDistributedItemsRowsId(ownerType));
    if (!target) {
      return [];
    }
    return Array.from(target.querySelectorAll('[data-distributed-item-row]')).map((row) => {
      const data = {
        itemType: row.querySelector('[data-field="itemType"]')?.value || '',
        itemSubtype: row.querySelector('[data-field="itemSubtype"]')?.value || '',
        unitLabel: row.querySelector('[data-field="unitLabel"]')?.value || '',
        status: row.querySelector('[data-field="status"]')?.value || '',
        quantityDistributed: row.querySelector('[data-field="quantityDistributed"]')?.value || '',
        quantityDestroyed: row.querySelector('[data-field="quantityDestroyed"]')?.value || '',
        quantitySurvived: row.querySelector('[data-field="quantitySurvived"]')?.value || '',
        quantityReturned: row.querySelector('[data-field="quantityReturned"]')?.value || '',
        quantityReplaced: row.querySelector('[data-field="quantityReplaced"]')?.value || '',
        distributionDate: row.querySelector('[data-field="distributionDate"]')?.value || '',
        relatedProjectId: row.querySelector('[data-field="relatedProjectId"]')?.value || '',
        relatedBeneficiaryId: row.querySelector('[data-field="relatedBeneficiaryId"]')?.value || '',
        relatedLocationId: row.querySelector('[data-field="relatedLocationId"]')?.value || '',
        notes: row.querySelector('[data-field="notes"]')?.value || ''
      };
      const hasValue = Object.values(data).some((value) => String(value || '').trim() !== '');
      return includeEmptyRows || hasValue ? data : null;
    }).filter(Boolean);
  }

  function resetDistributedItemsPanel(ownerType) {
    renderDistributedItemsPanel(ownerType, [{}]);
  }

  function buildDistributedItemSummary(item) {
    const counts = [
      item.quantityDistributed !== null && item.quantityDistributed !== undefined && item.quantityDistributed !== '' ? `Distributed ${item.quantityDistributed}` : '',
      item.quantityDestroyed !== null && item.quantityDestroyed !== undefined && item.quantityDestroyed !== '' ? `Destroyed ${item.quantityDestroyed}` : '',
      item.quantitySurvived !== null && item.quantitySurvived !== undefined && item.quantitySurvived !== '' ? `Survived ${item.quantitySurvived}` : '',
      item.quantityReturned !== null && item.quantityReturned !== undefined && item.quantityReturned !== '' ? `Returned ${item.quantityReturned}` : '',
      item.quantityReplaced !== null && item.quantityReplaced !== undefined && item.quantityReplaced !== '' ? `Replaced ${item.quantityReplaced}` : ''
    ].filter(Boolean).join(' | ');
    const linkedNames = [
      item.relatedProjectId ? `Project: ${getProjectById(Number(item.relatedProjectId))?.title || 'Linked project'}` : '',
      item.relatedBeneficiaryId ? `Beneficiary: ${getBeneficiaryById(Number(item.relatedBeneficiaryId))?.name || 'Linked beneficiary'}` : '',
      item.relatedLocationId ? `Location: ${getLocationById(Number(item.relatedLocationId))?.name || 'Linked location'}` : ''
    ].filter(Boolean).join(' | ');
    const subItems = getProjectItemSubItems(item);
    const subItemSummary = subItems.length
      ? `Sub-items: ${subItems.slice(0, 3).map((subItem) => buildProjectItemSubItemOutcome(subItem)).join('; ')}${subItems.length > 3 ? ` and ${subItems.length - 3} more` : ''}`
      : '';
    return [counts, linkedNames, subItemSummary, item.notes].filter(Boolean).join(' | ') || 'Structured item row saved without extra notes.';
  }

  function parseJsonSafely(value, fallback) {
    if (!value) {
      return fallback;
    }
    try {
      return JSON.parse(value);
    } catch (error) {
      return fallback;
    }
  }

  function normaliseProjectItemSubItems(subItems) {
    return (Array.isArray(subItems) ? subItems : []).map((subItem, index) => {
      const name = String(subItem?.name || subItem?.itemType || '').trim();
      const quantityDistributed = subItem?.quantityDistributed ?? '';
      const quantitySurvived = subItem?.quantitySurvived ?? '';
      const quantityFailed = subItem?.quantityFailed ?? subItem?.quantityDestroyed ?? '';
      const status = String(subItem?.status || '').trim();
      const notes = String(subItem?.notes || '').trim();
      const unitLabel = String(subItem?.unitLabel || '').trim();
      if (!name && quantityDistributed === '' && quantitySurvived === '' && quantityFailed === '' && !status && !notes && !unitLabel) {
        return null;
      }
      return {
        key: String(subItem?.key || `sub-${index + 1}`),
        name,
        quantityDistributed,
        quantitySurvived,
        quantityFailed,
        status,
        notes,
        unitLabel
      };
    }).filter(Boolean);
  }

  function getProjectItemSubItems(item) {
    return normaliseProjectItemSubItems(item?.customData?.subItems || []);
  }

  function getProjectItemSubItemByRef(ref) {
    if (!ref || !ref.itemId) {
      return null;
    }
    const parentItem = getProjectItemById(ref.itemId);
    if (!parentItem) {
      return null;
    }
    const subItems = getProjectItemSubItems(parentItem);
    return subItems.find((subItem, index) => String(subItem.key) === String(ref.subItemKey || '')) || subItems[Number(ref.index)] || null;
  }

  function buildProjectItemSubItemOutcome(subItem, fallbackUnit = 'items') {
    if (!subItem) {
      return '';
    }
    const unit = subItem.unitLabel || fallbackUnit || 'items';
    const metrics = [
      subItem.quantityDistributed !== '' ? `${subItem.quantityDistributed} ${unit}` : '',
      subItem.quantitySurvived !== '' ? `Survived ${subItem.quantitySurvived}` : '',
      subItem.quantityFailed !== '' ? `Failed ${subItem.quantityFailed}` : ''
    ].filter(Boolean).join(' | ');
    return [subItem.name || 'Sub-item', metrics].filter(Boolean).join(' - ');
  }

  function renderProjectItemSubItemRow(subItem = {}, index = 0) {
    const rowTitle = subItem.name || `Sub-item ${index + 1}`;
    return `
      <div class="project-item-subitem-row" data-project-item-subitem-row>
        <div class="distribution-item-row-header">
          <div>
            <div class="distribution-item-row-title">${escapeHtml(rowTitle)}</div>
            <div class="distribution-item-meta">Each sub-item keeps its own survival and failure history inside the parent item record.</div>
          </div>
          <button type="button" class="secondary-button distribution-item-remove" data-project-item-subitem-remove>Remove row</button>
        </div>
        <label><span>Sub-item name</span><input type="text" data-field="name" value="${escapeHtml(subItem.name || '')}" placeholder="e.g. Avocado seedlings"></label>
        <label><span>Subtype/variant</span><input type="text" data-field="status" value="${escapeHtml(subItem.status || '')}" placeholder="e.g. Hass grafted"></label>
        <label><span>Unit label</span><input type="text" data-field="unitLabel" value="${escapeHtml(subItem.unitLabel || '')}" placeholder="seedlings"></label>
        <label><span>How many</span><input type="number" min="0" step="0.01" data-field="quantityDistributed" value="${escapeHtml(subItem.quantityDistributed ?? '')}"></label>
        <label><span>Survived</span><input type="number" min="0" step="0.01" data-field="quantitySurvived" value="${escapeHtml(subItem.quantitySurvived ?? '')}"></label>
        <label><span>Failed/destroyed</span><input type="number" min="0" step="0.01" data-field="quantityFailed" value="${escapeHtml(subItem.quantityFailed ?? '')}"></label>
        <label class="full-span"><span>Sub-item notes</span><textarea rows="2" data-field="notes" placeholder="Explain survival, failure, follow-up, or species-specific observations.">${escapeHtml(subItem.notes || '')}</textarea></label>
      </div>
    `;
  }

  function renderProjectItemSubItemsPanel(subItems = []) {
    const target = byId('projectItemSubItemsRows');
    if (!target) {
      return;
    }
    const rows = Array.isArray(subItems) && subItems.length ? subItems : [{}];
    target.innerHTML = rows.map((subItem, index) => renderProjectItemSubItemRow(subItem, index)).join('');
    target.querySelectorAll('[data-project-item-subitem-remove]').forEach((button) => {
      button.addEventListener('click', () => {
        const row = button.closest('[data-project-item-subitem-row]');
        if (!row) {
          return;
        }
        const otherRows = target.querySelectorAll('[data-project-item-subitem-row]');
        if (otherRows.length === 1) {
          renderProjectItemSubItemsPanel([{}]);
          renderProjectItemIntelligence();
          return;
        }
        row.remove();
        renderProjectItemIntelligence();
      });
    });
  }

  function collectProjectItemSubItems(includeEmptyRows = false) {
    const target = byId('projectItemSubItemsRows');
    if (!target) {
      return [];
    }
    return Array.from(target.querySelectorAll('[data-project-item-subitem-row]')).map((row) => {
      const record = {
        name: row.querySelector('[data-field="name"]')?.value || '',
        status: row.querySelector('[data-field="status"]')?.value || '',
        unitLabel: row.querySelector('[data-field="unitLabel"]')?.value || '',
        quantityDistributed: row.querySelector('[data-field="quantityDistributed"]')?.value || '',
        quantitySurvived: row.querySelector('[data-field="quantitySurvived"]')?.value || '',
        quantityFailed: row.querySelector('[data-field="quantityFailed"]')?.value || '',
        notes: row.querySelector('[data-field="notes"]')?.value || ''
      };
      const hasValue = Object.values(record).some((value) => String(value || '').trim() !== '');
      return includeEmptyRows || hasValue ? record : null;
    }).filter(Boolean);
  }

  function renderDistributedItemCards(items, title = 'Distributed items') {
    if (!Array.isArray(items) || !items.length) {
      return '';
    }
    return `
      ${renderEntityGroup(title, items.map((item) => {
        if (!item || !item.id) {
          return '';
        }
        return entityTileHtml({
          type: 'project_item',
          id: item.id,
          title: [item.itemType, item.itemSubtype].filter(Boolean).join(' - ') || 'Project item',
          details: [
            buildDistributedItemSummary(item),
            item.projectTitle || '',
            [item.beneficiaryName || '', item.locationName || ''].filter(Boolean).join(' | ')
          ],
          badges: [item.categoryName, item.status].filter(Boolean)
        });
      }).filter(Boolean), 'No linked item rows yet.', 'story-grid')}
    `;
  }

  function formatLimitedList(values, limit = 3) {
    const safeValues = (values || []).filter(Boolean);
    if (!safeValues.length) {
      return 'none yet';
    }
    if (safeValues.length <= limit) {
      return safeValues.join(', ');
    }
    return `${safeValues.slice(0, limit).join(', ')} and ${safeValues.length - limit} more`;
  }

  function getNamedProjectContext(projectId) {
    const project = projectId ? getProjectById(Number(projectId)) : null;
    return {
      project,
      beneficiaryNames: project ? (project.beneficiaryIds || []).map((id) => getBeneficiaryById(id)?.name).filter(Boolean) : [],
      locationNames: project ? (project.locationIds || []).map((id) => getLocationById(id)?.name).filter(Boolean) : []
    };
  }

  function getProjectIdsForBeneficiary(beneficiaryId) {
    return getBootstrapArray('projects')
      .filter((item) => (item.beneficiaryIds || []).includes(Number(beneficiaryId)))
      .map((item) => item.id);
  }

  function getProjectIdsForLocation(locationId) {
    return getBootstrapArray('projects')
      .filter((item) => (item.locationIds || []).includes(Number(locationId)))
      .map((item) => item.id);
  }

  function applySmartProjectContextToForm(form, config) {
    if (!form || !config) {
      return;
    }
    const projectField = getFormField(form, config.projectField);
    const beneficiaryField = getFormField(form, config.beneficiaryField);
    const locationField = getFormField(form, config.locationField);
    if (!projectField || !beneficiaryField || !locationField) {
      return;
    }
    let projectId = Number(projectField.value || 0) || null;
    const beneficiaryId = Number(beneficiaryField.value || 0) || null;
    const locationId = Number(locationField.value || 0) || null;

    if (!projectId) {
      const beneficiaryProjects = beneficiaryId ? getProjectIdsForBeneficiary(beneficiaryId) : [];
      const locationProjects = locationId ? getProjectIdsForLocation(locationId) : [];
      const candidateSet = beneficiaryProjects.length && locationProjects.length
        ? beneficiaryProjects.filter((id) => locationProjects.includes(id))
        : (beneficiaryProjects.length ? beneficiaryProjects : locationProjects);
      if (candidateSet.length === 1) {
        projectId = candidateSet[0];
        projectField.value = String(projectId);
      }
    }

    const project = projectId ? getProjectById(projectId) : null;
    if (project) {
      if (!beneficiaryId && Array.isArray(project.beneficiaryIds) && project.beneficiaryIds.length === 1) {
        beneficiaryField.value = String(project.beneficiaryIds[0]);
      }
      if (!locationId && Array.isArray(project.locationIds) && project.locationIds.length === 1) {
        locationField.value = String(project.locationIds[0]);
      }
      if (config.categoryField) {
        const categoryField = getFormField(form, config.categoryField);
        if (categoryField && !categoryField.value && project.categoryId) {
          categoryField.value = String(project.categoryId);
        }
      }
    }
  }

  function getRelationCoverageScore(flags) {
    const values = Object.values(flags || {});
    if (!values.length) {
      return 0;
    }
    const matched = values.filter(Boolean).length;
    return Math.round((matched / values.length) * 100);
  }

  function buildCoverageBadge(score) {
    if (score >= 80) {
      return 'High continuity';
    }
    if (score >= 50) {
      return 'Moderate continuity';
    }
    return 'Early-stage continuity';
  }

  function renderIntelligencePanel(title, summary, signals, actions, warnings = []) {
    return `
      <div class="helper-block intelligence-panel">
        <div class="section-heading compact">
          <h3>${escapeHtml(title)}</h3>
        </div>
        <p class="intelligence-summary">${escapeHtml(summary)}</p>
        ${signals.length ? `
          <div class="intelligence-chip-row">
            ${signals.map((signal) => `<span class="status-badge">${escapeHtml(signal)}</span>`).join('')}
          </div>
        ` : ''}
        ${actions.length ? `
          <div class="intelligence-list">
            ${actions.map((item) => `<div class="intelligence-item">${escapeHtml(item)}</div>`).join('')}
          </div>
        ` : ''}
        ${warnings.length ? `
          <div class="intelligence-warning-list">
            ${warnings.map((item) => `<div class="intelligence-warning">${escapeHtml(item)}</div>`).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  function ensureFormIntelligenceContainers() {
    Object.entries(FORM_INTELLIGENCE_CONFIG).forEach(([formType, config]) => {
      const form = byId(config.formId);
      if (!form || form.querySelector(`[data-form-intelligence="${formType}"]`)) {
        return;
      }
      const container = document.createElement('div');
      container.className = 'full-span';
      container.dataset.formIntelligence = formType;
      const anchor = form.querySelector(config.insertBeforeSelector);
      if (anchor && anchor.parentNode) {
        anchor.parentNode.insertBefore(container, anchor);
      } else {
        form.appendChild(container);
      }
    });
  }

  function getFormIntelligenceContext(formType) {
    const config = FORM_INTELLIGENCE_CONFIG[formType];
    const form = config ? byId(config.formId) : null;
    if (!form) {
      return null;
    }
    const value = (name) => getFormField(form, name)?.value || '';
    const multi = (id) => {
      const node = byId(id);
      return node ? getMultipleSelectValues(node) : [];
    };
    if (formType === 'project') {
      return {
        categoryId: value('categoryId'),
        status: value('status'),
        beneficiaryIds: multi('projectBeneficiarySelect'),
        locationIds: multi('projectLocationSelect'),
        distributedItems: collectDistributedItems('project'),
        customData: parseJsonFieldSafe(value('customData'), {})
      };
    }
    if (formType === 'beneficiary') {
      return {
        type: value('type'),
        projectIds: multi('beneficiaryProjectSelect'),
        locationIds: multi('beneficiaryLocationSelect'),
        distributedItems: collectDistributedItems('beneficiary'),
        county: value('county'),
        village: value('village')
      };
    }
    if (formType === 'location') {
      return {
        locationType: value('locationType'),
        county: value('county'),
        village: value('village'),
        distributedItems: collectDistributedItems('location')
      };
    }
    if (formType === 'excel_import') {
      return {
        projectId: value('relatedProjectId'),
        beneficiaryId: value('beneficiaryId'),
        locationId: value('locationId'),
        description: value('description')
      };
    }
    if (formType === 'document') {
      return {
        projectId: value('relatedProjectId'),
        beneficiaryId: value('beneficiaryId'),
        locationId: value('locationId'),
        activityId: value('activityId'),
        categoryId: value('categoryId'),
        tags: value('tags')
      };
    }
    if (formType === 'photo') {
      return {
        projectId: value('projectId'),
        beneficiaryId: value('beneficiaryId'),
        locationId: value('locationId'),
        activityId: value('activityId'),
        tags: value('tags'),
        queueCount: byId('photoUploadQueue')?.querySelectorAll('.media-upload-row').length || 0
      };
    }
    if (formType === 'map') {
      return {
        sourceType: value('sourceType'),
        provider: value('provider'),
        status: value('status'),
        projectId: value('projectId'),
        beneficiaryId: value('beneficiaryId'),
        locationId: value('locationId'),
        activityId: value('activityId'),
        dutyId: value('dutyId'),
        latitude: value('latitude'),
        longitude: value('longitude'),
        centreQuery: value('centreQuery'),
        embedHtml: value('embedHtml'),
        googleApiKey: value('googleApiKey'),
        fileSelected: !!getFormField(form, 'filePath')?.files?.length
      };
    }
    if (formType === 'activity') {
      return {
        activityType: value('activityType'),
        categoryId: value('categoryId'),
        projectId: value('projectId'),
        beneficiaryId: value('beneficiaryId'),
        locationId: value('locationId'),
        metricsJson: parseJsonFieldSafe(value('metricsJson'), {})
      };
    }
    if (formType === 'duty') {
      return {
        dutyType: value('dutyType'),
        assignedUserId: value('assignedUserId'),
        assignedBeneficiaryId: value('assignedBeneficiaryId'),
        projectId: value('projectId'),
        locationId: value('locationId'),
        assignedDate: value('assignedDate'),
        dueDate: value('dueDate'),
        status: value('status'),
        priority: value('priority')
      };
    }
    return {
      entryType: value('entryType'),
      projectId: value('projectId'),
      beneficiaryId: value('beneficiaryId'),
      locationId: value('locationId'),
      activityId: value('activityId'),
      documentId: value('documentId'),
      photoId: value('photoId'),
      excelImportId: value('excelImportId'),
      reportId: value('reportId')
    };
  }

  function buildFormIntelligenceModel(formType, context) {
    const signals = [];
    const actions = [];
    const warnings = [];
    let summary = 'The form is ready for safe structured entry.';

    if (formType === 'project') {
      const category = getCategoryById(context.categoryId);
      const coverage = getRelationCoverageScore({
        category: !!context.categoryId,
        beneficiaries: !!context.beneficiaryIds.length,
        locations: !!context.locationIds.length,
        distributedItems: !!context.distributedItems.length
      });
      signals.push(buildCoverageBadge(coverage));
      if (category) {
        signals.push(category.name);
      }
      if (context.distributedItems.length) {
        signals.push(`${context.distributedItems.length} item rows`);
      }
      summary = category
        ? `${category.name} projects now drive field logic, relation checks, and story continuity suggestions from one place.`
        : 'Choose a category first so the project can inherit the right field guidance, item logic, and story expectations.';
      const selectedBeneficiaries = context.beneficiaryIds.map((id) => getBeneficiaryById(id)?.name).filter(Boolean);
      const selectedLocations = context.locationIds.map((id) => getLocationById(id)?.name).filter(Boolean);
      if (selectedBeneficiaries.length) {
        actions.push(`Linked beneficiaries already shape the story chain: ${formatLimitedList(selectedBeneficiaries)}.`);
      } else {
        warnings.push('No beneficiaries are linked yet, so downstream activity, evidence, and impact stories will be thinner.');
      }
      if (selectedLocations.length) {
        actions.push(`Linked locations will anchor the history trail through ${formatLimitedList(selectedLocations)}.`);
      } else {
        warnings.push('No locations are linked yet, so geography and place-based reporting will remain weak.');
      }
      if (!context.distributedItems.length && category && ['Tree Planting', 'Seedling Distribution', 'Energy-saving Cookstoves', 'Biogas Installation', 'Fish Farming', 'Water Project'].includes(category.name)) {
        actions.push('Consider adding distributed item rows so quantities, loss, survival, replacement, and follow-up can be traced later.');
      }
    } else if (formType === 'beneficiary') {
      const coverage = getRelationCoverageScore({
        type: !!context.type,
        projects: !!context.projectIds.length,
        locations: !!context.locationIds.length,
        items: !!context.distributedItems.length
      });
      signals.push(buildCoverageBadge(coverage));
      if (context.type) {
        signals.push(humanise(context.type));
      }
      summary = 'Beneficiary intelligence watches whether this record is connected enough to support future project history, evidence, and outcome tracking.';
      if (context.projectIds.length) {
        actions.push(`Project links already exist for ${context.projectIds.length} record(s), which improves narrative continuity.`);
      } else {
        warnings.push('No projects are linked yet, so this beneficiary may stay isolated from reports and timeline history.');
      }
      if (context.locationIds.length) {
        actions.push(`Location links will help this beneficiary appear in place-based stories and geo retrieval.`);
      } else if (!context.county && !context.village) {
        warnings.push('Neither location links nor manual area fields are filled yet.');
      }
      if (context.distributedItems.length) {
        actions.push(`Item tracking is active for this beneficiary with ${context.distributedItems.length} structured row(s).`);
      }
    } else if (formType === 'location') {
      const coverage = getRelationCoverageScore({
        type: !!context.locationType,
        county: !!context.county,
        village: !!context.village,
        items: !!context.distributedItems.length
      });
      signals.push(buildCoverageBadge(coverage));
      if (context.locationType) {
        signals.push(humanise(context.locationType));
      }
      summary = 'Location intelligence strengthens place-based retrieval so the app can reconstruct who, what, and where across the record cycle.';
      if (!context.county) {
        warnings.push('County is still empty, which weakens administrative grouping and future reports.');
      }
      if (!context.distributedItems.length) {
        actions.push('If this place stores or receives materials, add item rows so place history becomes measurable.');
      }
    } else if (formType === 'excel_import') {
      const projectContext = getNamedProjectContext(context.projectId);
      const coverage = getRelationCoverageScore({
        project: !!context.projectId,
        beneficiary: !!context.beneficiaryId,
        location: !!context.locationId,
        description: !!context.description
      });
      signals.push(buildCoverageBadge(coverage));
      summary = 'Import intelligence helps the workbook enter the graph cleanly before row review and conversion begin.';
      if (projectContext.project) {
        actions.push(`The selected project already carries beneficiaries such as ${formatLimitedList(projectContext.beneficiaryNames)} and locations such as ${formatLimitedList(projectContext.locationNames)}.`);
      }
      if (!context.projectId && !context.beneficiaryId && !context.locationId) {
        warnings.push('No core links are selected yet, so imported rows may need more manual linking later.');
      }
    } else if (formType === 'document' || formType === 'photo') {
      const projectContext = getNamedProjectContext(context.projectId);
      const coverage = getRelationCoverageScore({
        project: !!context.projectId,
        beneficiary: !!context.beneficiaryId,
        location: !!context.locationId,
        activity: !!context.activityId
      });
      signals.push(buildCoverageBadge(coverage));
      summary = formType === 'document'
        ? 'Document intelligence checks whether uploaded evidence is anchored deeply enough to support extraction, review, and later retrieval.'
        : 'Media intelligence checks whether uploaded evidence is connected tightly enough to remain useful in future story reconstruction.';
      if (projectContext.project) {
        actions.push(`Selected project context suggests nearby links: beneficiaries ${formatLimitedList(projectContext.beneficiaryNames)}; locations ${formatLimitedList(projectContext.locationNames)}.`);
      }
      if (formType === 'photo' && !context.queueCount) {
        warnings.push('No image queue is prepared yet.');
      }
      if (!context.projectId && !context.beneficiaryId && !context.locationId && !context.activityId) {
        warnings.push('This upload currently has no anchor in the story graph.');
      }
    } else if (formType === 'map') {
      const projectContext = getNamedProjectContext(context.projectId);
      const selectedBeneficiary = getBeneficiaryById(context.beneficiaryId);
      const selectedLocation = getLocationById(context.locationId);
      const coverage = getRelationCoverageScore({
        project: !!context.projectId,
        location: !!context.locationId,
        coordinates: !!(context.latitude && context.longitude),
        source: !!context.sourceType
      });
      signals.push(buildCoverageBadge(coverage));
      if (context.sourceType) {
        signals.push(humanise(context.sourceType));
      }
      if (context.provider) {
        signals.push(humanise(context.provider));
      }
      summary = 'Map intelligence checks whether the capture method, coordinates, and linked records are strong enough to keep the map useful in future storytelling and retrieval.';
      if (projectContext.project) {
        actions.push(`Project context can guide beneficiary and location anchoring through ${formatLimitedList(projectContext.locationNames)} and ${formatLimitedList(projectContext.beneficiaryNames)}.`);
      }
      if (!context.projectId && !context.beneficiaryId && !context.locationId && !context.activityId && !context.dutyId) {
        warnings.push('No linked project, beneficiary, location, activity, or duty is selected yet.');
      }
      if (
        projectContext.project &&
        selectedBeneficiary &&
        !projectContext.project.beneficiaryIds.includes(selectedBeneficiary.id)
      ) {
        warnings.push('The selected beneficiary is not currently linked to the chosen project.');
      }
      if (
        projectContext.project &&
        selectedLocation &&
        !projectContext.project.locationIds.includes(selectedLocation.id)
      ) {
        warnings.push('The selected location is not currently linked to the chosen project.');
      }
      if (context.sourceType === 'google_static_api' && !context.googleApiKey) {
        warnings.push('Google Static mode needs an API key before the app can capture an image safely.');
      }
      if (context.sourceType === 'google_embed_snippet' && !context.embedHtml) {
        warnings.push('Embed snippet mode needs a pasted Google Maps iframe snippet or reference HTML.');
      }
      if (context.sourceType === 'uploaded_image' && !context.fileSelected) {
        warnings.push('Upload mode needs a map image or screenshot file.');
      }
      if (!context.latitude || !context.longitude) {
        actions.push('Coordinates are still optional, but adding them will improve place recovery and later map reuse.');
      }
    } else if (formType === 'activity') {
      const category = getCategoryById(context.categoryId);
      const projectContext = getNamedProjectContext(context.projectId);
      const metricsKeys = Object.keys(context.metricsJson || {});
      const coverage = getRelationCoverageScore({
        type: !!context.activityType,
        project: !!context.projectId,
        beneficiary: !!context.beneficiaryId,
        location: !!context.locationId
      });
      signals.push(buildCoverageBadge(coverage));
      if (context.activityType) {
        signals.push(humanise(context.activityType));
      }
      if (category) {
        signals.push(category.name);
      }
      summary = 'Activity intelligence checks whether the field event is fully attached to the people, place, and project that give it historical meaning.';
      if (projectContext.project) {
        actions.push(`The selected project can guide beneficiary and location choices through ${formatLimitedList(projectContext.beneficiaryNames)} and ${formatLimitedList(projectContext.locationNames)}.`);
      }
      if (metricsKeys.length) {
        actions.push(`Metrics already prepared: ${formatLimitedList(metricsKeys.map((key) => humanise(key)), 4)}.`);
      } else {
        warnings.push('No metrics JSON is recorded yet, so impact summaries may miss this activity.');
      }
    } else if (formType === 'duty') {
      const projectContext = getNamedProjectContext(context.projectId);
      const selectedBeneficiary = getBeneficiaryById(context.assignedBeneficiaryId);
      const selectedLocation = getLocationById(context.locationId);
      const coverage = getRelationCoverageScore({
        type: !!context.dutyType,
        assignedUser: !!context.assignedUserId,
        project: !!context.projectId,
        location: !!context.locationId
      });
      signals.push(buildCoverageBadge(coverage));
      if (context.status) {
        signals.push(humanise(context.status));
      }
      if (context.priority) {
        signals.push(`${humanise(context.priority)} priority`);
      }
      summary = 'Duty intelligence checks whether the assignment is anchored to the right person, place, and project before it enters calendar and history views.';
      if (projectContext.project) {
        actions.push(`The selected project can guide place and beneficiary context through ${formatLimitedList(projectContext.locationNames)} and ${formatLimitedList(projectContext.beneficiaryNames)}.`);
      }
      if (!context.assignedUserId && !context.assignedBeneficiaryId) {
        warnings.push('No assignee is selected yet, so this duty may not show clear responsibility.');
      }
      if (
        projectContext.project &&
        selectedBeneficiary &&
        !projectContext.project.beneficiaryIds.includes(selectedBeneficiary.id)
      ) {
        warnings.push('The selected beneficiary is not currently linked to the chosen project.');
      }
      if (
        projectContext.project &&
        selectedLocation &&
        !projectContext.project.locationIds.includes(selectedLocation.id)
      ) {
        warnings.push('The selected location is not currently linked to the chosen project.');
      }
      if (!context.dueDate) {
        warnings.push('No due date is recorded yet, which weakens schedule clarity in the calendar view.');
      }
    } else {
      const coverage = getRelationCoverageScore({
        project: !!context.projectId,
        beneficiary: !!context.beneficiaryId,
        location: !!context.locationId,
        activity: !!context.activityId,
        document: !!context.documentId || !!context.photoId || !!context.excelImportId || !!context.reportId
      });
      signals.push(buildCoverageBadge(coverage));
      if (context.entryType) {
        signals.push(humanise(context.entryType));
      }
      summary = 'Timeline intelligence helps every manual event sit inside the wider operational chain instead of becoming an isolated note.';
      if (!context.projectId && !context.beneficiaryId && !context.locationId && !context.activityId) {
        warnings.push('No core record is linked yet, so this note may be hard to recover later.');
      } else {
        actions.push('This note can act as a bridge event across multiple linked records once saved.');
      }
    }

    return { summary, signals, actions, warnings };
  }

  function renderFormIntelligence(formType) {
    const config = FORM_INTELLIGENCE_CONFIG[formType];
    const form = config ? byId(config.formId) : null;
    const target = form ? form.querySelector(`[data-form-intelligence="${formType}"]`) : null;
    const context = getFormIntelligenceContext(formType);
    if (!target || !context) {
      return;
    }
    const model = buildFormIntelligenceModel(formType, context);
    target.innerHTML = renderIntelligencePanel(config.title, model.summary, model.signals, model.actions, model.warnings);
  }

  function bindFormIntelligence(formType) {
    const config = FORM_INTELLIGENCE_CONFIG[formType];
    const form = config ? byId(config.formId) : null;
    if (!form || form.dataset.intelligenceBound === 'true') {
      return;
    }
    const refresh = () => renderFormIntelligence(formType);
    form.addEventListener('input', refresh);
    form.addEventListener('change', refresh);
    form.dataset.intelligenceBound = 'true';
    refresh();
  }

  function renderAllFormIntelligence() {
    ensureFormIntelligenceContainers();
    Object.keys(FORM_INTELLIGENCE_CONFIG).forEach((formType) => {
      bindFormIntelligence(formType);
      renderFormIntelligence(formType);
    });
  }

  function buildCycleModel(type, bundle) {
    const count = (key) => Array.isArray(bundle?.[key]) ? bundle[key].length : 0;
    const linkedProject = bundle?.project ? 1 : 0;
    const linkedBeneficiary = bundle?.beneficiary ? 1 : 0;
    const linkedLocation = bundle?.location ? 1 : 0;
    const linkedActivity = bundle?.activity ? 1 : 0;
    const coreCoverage = getRelationCoverageScore({
      project: type === 'project' || !!linkedProject || count('projects') > 0,
      beneficiary: type === 'beneficiary' || !!linkedBeneficiary || count('beneficiaries') > 0,
      location: type === 'location' || !!linkedLocation || count('locations') > 0,
      activity: type === 'activity' || !!linkedActivity || count('activities') > 0
    });
    const signals = [buildCoverageBadge(coreCoverage)];
    const actions = [];
    const warnings = [];
    let summary = 'This record already participates in the app-wide history cycle.';
    if (count('timeline') || bundle?.timeline) {
      signals.push(`${count('timeline')} timeline`);
    }
    if (count('documents')) {
      signals.push(`${count('documents')} documents`);
    }
    if (count('photos')) {
      signals.push(`${count('photos')} photos`);
    }
    if (count('maps')) {
      signals.push(`${count('maps')} maps`);
    }
    if (count('entries')) {
      signals.push(`${count('entries')} extracted`);
    }
    if (count('duties')) {
      signals.push(`${count('duties')} duties`);
    }
    if (type === 'project') {
      summary = `This project currently connects ${count('beneficiaries')} beneficiaries, ${count('locations')} locations, ${count('activities')} activities, ${count('duties')} duties, ${count('maps')} maps, ${count('documents')} documents, ${count('photos')} photos, and ${count('entries')} extracted entries.`;
      if (!count('activities')) warnings.push('No activities are linked yet, so implementation history is still thin.');
      if (!count('documents') && !count('photos')) warnings.push('No evidence is linked yet, so proof-of-work is still weak.');
      if (count('beneficiaries') && count('locations')) actions.push('The core people-place-project chain is already in place for richer reporting.');
    } else if (type === 'beneficiary') {
      summary = `This beneficiary currently sits inside ${count('projects')} projects, ${count('locations')} locations, ${count('activities')} activities, ${count('duties')} duties, ${count('maps')} maps, and ${count('timeline')} timeline events.`;
      if (!count('projects')) warnings.push('No projects are linked yet, so the beneficiary story remains isolated.');
      if (!count('photos') && !count('documents')) actions.push('Add evidence to make the beneficiary journey more concrete over time.');
    } else if (type === 'location') {
      summary = `This location currently anchors ${count('projects')} projects, ${count('beneficiaries')} beneficiaries, ${count('activities')} activities, ${count('duties')} duties, ${count('maps')} maps, ${count('documents')} documents, and ${count('photos')} evidence items.`;
      if (!count('projects') && !count('beneficiaries')) warnings.push('The location has not yet become a strong story anchor.');
    } else if (type === 'activity') {
      summary = 'This activity bridges planning, field implementation, evidence, reporting, and follow-up in one operational event chain.';
      if (!linkedProject && !linkedBeneficiary && !linkedLocation) warnings.push('The activity lacks core links, so its context is fragile.');
    } else if (type === 'duty') {
      summary = 'This duty keeps responsibility, timing, and linked operational context visible across the story cycle.';
    } else if (type === 'map') {
      summary = 'This map keeps spatial evidence, capture method, and linked operational records visible across the story cycle.';
    } else if (type === 'document') {
      summary = 'This document acts as a source node for evidence, extraction, review, and report preparation.';
      if (!count('entries')) actions.push('If extraction succeeded lightly, more value will come from reviewing and linking its entries.');
    } else if (type === 'photo') {
      summary = 'This evidence item can lead viewers back from proof media to the underlying record chain.';
    } else if (type === 'excel_import') {
      summary = `This import currently holds ${count('entries')} extracted rows and remains a reusable bridge between raw workbook evidence and clean app records.`;
    } else if (type === 'extracted_entry') {
      summary = 'This extracted entry preserves raw history while allowing controlled cleaning, linking, and conversion.';
    } else if (type === 'timeline') {
      summary = 'This timeline event can connect otherwise separate records into one readable historical sequence.';
    } else if (type === 'report') {
      summary = 'This report remains attached to the operational graph and can be traced back to its source records.';
    } else {
      summary = 'This page acts as a regional roll-up over the wider project record graph.';
    }
    return { summary, signals, actions, warnings };
  }

  function renderCycleIntelligencePanel(type, bundle, title = 'Cycle intelligence') {
    const model = buildCycleModel(type, bundle);
    return renderIntelligencePanel(title, model.summary, model.signals, model.actions, model.warnings);
  }

  function inferEntryTargetType(entry) {
    const suggestedByCategory = getPreferredEntryTargetByCategory(entry?.categoryId);
    if (suggestedByCategory) {
      return suggestedByCategory;
    }
    const text = JSON.stringify({
      rawText: entry?.rawText || '',
      cleanedText: entry?.cleanedText || '',
      cleanedJson: entry?.cleanedJson || {},
      rawJson: entry?.rawJson || {}
    }).toLowerCase();
    if (/(school|group|beneficiary|household|institution|farmer|recipient)/.test(text)) {
      return 'beneficiary';
    }
    if (/(village|ward|county|location|site|spring|pond)/.test(text)) {
      return 'location';
    }
    if (/(training|visit|installation|activity|follow up|follow-up)/.test(text)) {
      return 'activity';
    }
    return 'project';
  }

  function getEntrySchemaHints(entry) {
    const categorySchema = getCategorySchema(entry?.categoryId);
    const suggestedTarget = inferEntryTargetType(entry);
    const suggestedActivityType = getPreferredActivityTypeByCategory(entry?.categoryId);
    return {
      suggestedTarget,
      suggestedActivityType,
      relatedRecordFocus: categorySchema?.relatedRecordFocus || ENVIRONMENT_SCHEMA_REGISTRY.recordTemplates[suggestedTarget]?.preferredFields || [],
      canonicalFields: categorySchema?.canonicalFields || []
    };
  }

  function normaliseSchemaToken(value) {
    return String(value || '')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function getEntrySchemaCoverage(entry) {
    const schemaHints = getEntrySchemaHints(entry);
    const readableFields = getEntryDisplayFields(entry, Infinity);
    const fieldMap = new Map();

    readableFields.forEach((field) => {
      const labelToken = normaliseSchemaToken(field.label);
      const valueToken = normaliseSchemaToken(field.value);
      fieldMap.set(labelToken, {
        ...field,
        labelToken,
        valueToken,
        hasValue: String(field.value || '').trim() !== ''
      });
    });

    const canonical = schemaHints.canonicalFields.map((fieldKey) => {
      const canonicalToken = normaliseSchemaToken(fieldKey);
      const matchedField = Array.from(fieldMap.values()).find((field) => (
        field.labelToken === canonicalToken
        || field.labelToken.includes(canonicalToken)
        || canonicalToken.includes(field.labelToken)
      ));
      return {
        fieldKey,
        canonicalToken,
        matchedLabel: matchedField ? matchedField.label : '',
        hasValue: !!matchedField?.hasValue
      };
    });

    return {
      schemaHints,
      canonical,
      matchedLabels: canonical.filter((item) => item.matchedLabel).map((item) => item.matchedLabel),
      missingCanonical: canonical.filter((item) => !item.matchedLabel || !item.hasValue)
    };
  }

  function getSchemaFieldAliases(fieldKey) {
    const aliasMap = {
      treeSpecies: ['tree species', 'species', 'seedling species', 'species planted'],
      numberPlanted: ['number planted', 'trees planted', 'planted', 'quantity planted'],
      plantingDate: ['planting date', 'date planted', 'planting day'],
      survivalCount: ['survival count', 'survived', 'survival', 'live trees'],
      followUpVisitNotes: ['follow up', 'follow-up', 'visit notes', 'monitoring notes'],
      seedlingSpecies: ['seedling species', 'species', 'seedling type'],
      distributionDate: ['distribution date', 'date issued', 'date distributed'],
      recipientsCount: ['recipients', 'beneficiaries reached', 'households reached'],
      seedlingsIssued: ['issued', 'distributed', 'supplied', 'quantity issued'],
      seedlingsSurvived: ['survived', 'survival', 'surviving seedlings'],
      seedlingsLost: ['destroyed', 'lost', 'dead seedlings', 'damaged seedlings'],
      householdName: ['household', 'household name', 'beneficiary household'],
      digesterType: ['digester type', 'biogas unit', 'unit type'],
      installationDate: ['installation date', 'installed on', 'date installed'],
      capacity: ['capacity', 'size', 'volume'],
      livestockCount: ['livestock count', 'cattle', 'animals'],
      technician: ['technician', 'installer', 'artisan'],
      stoveType: ['stove type', 'cookstove type', 'model'],
      quantityInstalled: ['installed', 'quantity installed', 'number installed'],
      trainingStatus: ['training status', 'trained', 'orientation'],
      fuelSavingEstimate: ['fuel saving', 'fuel saved', 'savings estimate'],
      followUpStatus: ['follow up status', 'follow-up status', 'monitoring status'],
      pondOwner: ['pond owner', 'owner', 'group name'],
      pondSize: ['pond size', 'pond area', 'size'],
      fingerlingsSupplied: ['fingerlings', 'fingerlings supplied', 'stocked'],
      fishSpecies: ['fish species', 'species'],
      stockingDate: ['stocking date', 'date stocked'],
      mortalityRecords: ['mortality', 'deaths', 'losses'],
      waterSourceType: ['water source', 'source type', 'spring type'],
      householdsServed: ['households served', 'beneficiaries served', 'users served'],
      protectionStatus: ['protection status', 'protected', 'status'],
      committeeName: ['committee', 'committee name', 'water committee'],
      waterQualityNote: ['water quality', 'quality note', 'quality status'],
      sessionTopic: ['session topic', 'topic', 'training topic'],
      traineesCount: ['trainees', 'participants', 'people trained'],
      trainerName: ['trainer', 'facilitator'],
      keyOutcome: ['key outcome', 'outcome', 'result'],
      nextTrainingDate: ['next training date', 'follow-up training'],
      restorationMethod: ['restoration method', 'method', 'approach'],
      areaCovered: ['area covered', 'hectares', 'coverage'],
      speciesUsed: ['species used', 'species'],
      erosionSeverity: ['erosion severity', 'severity'],
      monitoringNote: ['monitoring note', 'monitoring notes', 'observation'],
      schoolName: ['school', 'school name', 'institution'],
      clubName: ['club', 'club name'],
      pupilsReached: ['pupils reached', 'learners reached', 'students reached'],
      teacherCoordinator: ['teacher coordinator', 'teacher', 'patron'],
      clubActivity: ['club activity', 'activity notes'],
      resilienceTheme: ['resilience theme', 'theme', 'climate theme'],
      householdsReached: ['households reached', 'families reached'],
      adaptationPractice: ['adaptation practice', 'practice'],
      riskNote: ['risk note', 'risk', 'climate risk'],
      nextReviewDate: ['next review date', 'review date'],
      interventionType: ['intervention type', 'activity type', 'project type'],
      targetGroup: ['target group', 'group', 'audience'],
      outputMeasure: ['output measure', 'output', 'indicator'],
      evidenceNeeded: ['evidence needed', 'evidence', 'proof needed'],
      followUpAction: ['follow up action', 'follow-up action', 'next action']
    };
    return aliasMap[fieldKey] || [];
  }

  function getEntryMappingCandidates(entry) {
    const schemaHints = getEntrySchemaHints(entry);
    const templateFields = ENVIRONMENT_SCHEMA_REGISTRY.recordTemplates[schemaHints.suggestedTarget]?.preferredFields || [];
    return Array.from(new Set([
      ...schemaHints.canonicalFields,
      ...templateFields
    ]));
  }

  function scoreEntryMappingCandidate(labelToken, candidateToken, aliasTokens) {
    if (!labelToken || !candidateToken) {
      return 0;
    }
    if (labelToken === candidateToken) {
      return 100;
    }
    if (aliasTokens.includes(labelToken)) {
      return 90;
    }
    if (aliasTokens.some((alias) => alias && (labelToken.includes(alias) || alias.includes(labelToken)))) {
      return 72;
    }
    if (labelToken.includes(candidateToken) || candidateToken.includes(labelToken)) {
      return 64;
    }
    const labelWords = labelToken.split(' ').filter(Boolean);
    const candidateWords = Array.from(new Set([candidateToken, ...aliasTokens])).join(' ').split(' ').filter(Boolean);
    const overlap = labelWords.filter((word) => candidateWords.includes(word));
    return overlap.length >= 2 ? overlap.length * 20 : 0;
  }

  function getSuggestedEntryMappings(entry) {
    const readableFields = getEntryDisplayFields(entry, Infinity);
    const displayColumns = Array.isArray(entry?.rawJson?.displayColumns) ? entry.rawJson.displayColumns : [];
    const displayColumnMap = new Map(displayColumns.map((column) => [column.label, column]));
    const candidateFields = getEntryMappingCandidates(entry);
    const suggestions = [];

    readableFields.forEach((field) => {
      const column = displayColumnMap.get(field.label);
      if (column?.canonicalField) {
        suggestions.push({
          targetField: column.canonicalField,
          sourceLabel: field.label,
          confidence: 'direct'
        });
        return;
      }

      const labelToken = normaliseSchemaToken(field.label);
      let bestMatch = null;

      candidateFields.forEach((candidate) => {
        const candidateToken = normaliseSchemaToken(candidate);
        const aliasTokens = [candidateToken, ...getSchemaFieldAliases(candidate).map(normaliseSchemaToken)].filter(Boolean);
        const score = scoreEntryMappingCandidate(labelToken, candidateToken, aliasTokens);
        if (!bestMatch || score > bestMatch.score) {
          bestMatch = { targetField: candidate, score };
        }
      });

      if (bestMatch && bestMatch.score >= 40) {
        suggestions.push({
          targetField: bestMatch.targetField,
          sourceLabel: field.label,
          confidence: bestMatch.score >= 72 ? 'high' : 'review'
        });
      }
    });

    const unique = new Map();
    suggestions.forEach((item) => {
      if (!item.targetField || !item.sourceLabel || unique.has(item.targetField)) {
        return;
      }
      unique.set(item.targetField, item);
    });
    return Array.from(unique.values());
  }

  function getEntryMappingProfileSignature(entry) {
    return getEntryDisplayFields(entry, Infinity)
      .map((field) => normaliseSchemaToken(field.label))
      .filter(Boolean)
      .join('|');
  }

  function getMappingProfileFieldMap(profile) {
    const mappingJson = profile?.mappingJson || {};
    if (mappingJson.fields && typeof mappingJson.fields === 'object' && !Array.isArray(mappingJson.fields)) {
      return mappingJson.fields;
    }
    return mappingJson;
  }

  function getExcelMappingProfiles(entry) {
    const currentSignature = getEntryMappingProfileSignature(entry);
    const currentCategoryId = Number(entry?.categoryId || 0) || null;
    return getBootstrapArray('mappingProfiles')
      .filter((profile) => profile.sourceType === 'excel')
      .map((profile) => {
        const mappingJson = profile.mappingJson || {};
        const headerMatch = !mappingJson.headerSignature || mappingJson.headerSignature === currentSignature;
        const categoryMatch = !mappingJson.categoryId || !currentCategoryId || Number(mappingJson.categoryId) === currentCategoryId;
        const compatibilityRank = headerMatch && categoryMatch ? 0 : headerMatch ? 1 : 2;
        return {
          ...profile,
          compatibilityRank,
          compatibilityLabel: compatibilityRank === 0 ? 'Best match' : compatibilityRank === 1 ? 'Header match' : 'Saved profile'
        };
      })
      .sort((left, right) => (
        left.compatibilityRank - right.compatibilityRank
        || String(left.profileName || '').localeCompare(String(right.profileName || ''))
      ));
  }

  function getSavedMappingFieldByLabel(entry, fieldLabel) {
    const mappingPairs = Object.entries(entry?.mappedFieldsJson || {});
    const match = mappingPairs.find(([, sourceLabel]) => sourceLabel === fieldLabel);
    return match ? match[0] : '';
  }

  function getSelectedMappingFieldByLabel(entry, fieldLabel) {
    const suggestedMatch = getSuggestedEntryMappings(entry).find((item) => item.sourceLabel === fieldLabel);
    return getSavedMappingFieldByLabel(entry, fieldLabel) || suggestedMatch?.targetField || '';
  }

  function renderEntryMappingOptions(entry, fieldLabel) {
    const candidateFields = getEntryMappingCandidates(entry);
    const selectedField = getSelectedMappingFieldByLabel(entry, fieldLabel);
    return [
      '<option value="">No mapped target</option>',
      ...candidateFields.map((fieldKey) => (
        `<option value="${escapeHtml(fieldKey)}" ${selectedField === fieldKey ? 'selected' : ''}>${escapeHtml(humanise(fieldKey))}</option>`
      ))
    ].join('');
  }

  function renderMappingProfileOptions(entry) {
    const profiles = getExcelMappingProfiles(entry);
    return [
      '<option value="">Select saved mapping profile</option>',
      ...profiles.map((profile) => (
        `<option value="${escapeHtml(profile.id)}">${escapeHtml(`${profile.profileName} · ${humanise(profile.targetRecordType)} · ${profile.compatibilityLabel}`)}</option>`
      ))
    ].join('');
  }

  function getDefaultMappingProfileName(entry) {
    const categoryName = getCategoryById(entry?.categoryId)?.name || 'General';
    const sheetName = entry?.sourceSheetName || 'Worksheet';
    return `${sheetName} ${categoryName} mapping`;
  }

  function describeMappingProfileOrigin(profile) {
    if (!profile) {
      return 'Select a saved mapping profile to view its original source sheet and category context.';
    }
    const mappingJson = profile.mappingJson || {};
    const sourceSheetName = mappingJson.sourceSheetName || 'Unknown sheet';
    const categoryName = mappingJson.categoryId ? (getCategoryById(mappingJson.categoryId)?.name || 'Unknown category') : 'Any category';
    return `Saved from sheet "${sourceSheetName}" and category "${categoryName}".`;
  }

  function renderMappingProfileCompatibility(profile, currentCategoryId) {
    if (!profile) {
      return '';
    }
    const profileCategoryId = Number(profile.mappingJson?.categoryId || 0) || null;
    const activeCategoryId = Number(currentCategoryId || 0) || null;
    if (!profileCategoryId || !activeCategoryId || profileCategoryId === activeCategoryId) {
      return '<span class="status-badge schema-hit-badge">Category aligned</span>';
    }
    const profileCategoryName = getCategoryById(profileCategoryId)?.name || 'Saved category';
    const activeCategoryName = getCategoryById(activeCategoryId)?.name || 'Current category';
    return `<span class="status-badge schema-missing-badge">Category differs: ${escapeHtml(profileCategoryName)} -> ${escapeHtml(activeCategoryName)}</span>`;
  }

  function renderMappingProfileSheetBadge(profile, currentSheetName) {
    if (!profile) {
      return '';
    }
    const profileSheetName = String(profile.mappingJson?.sourceSheetName || '').trim();
    const activeSheetName = String(currentSheetName || '').trim();
    if (!profileSheetName || !activeSheetName) {
      return '<span class="status-badge">Sheet context unavailable</span>';
    }
    if (profileSheetName === activeSheetName) {
      return '<span class="status-badge schema-hit-badge">Same sheet source</span>';
    }
    return `<span class="status-badge schema-missing-badge">Different sheet: ${escapeHtml(profileSheetName)} -> ${escapeHtml(activeSheetName)}</span>`;
  }

  function buildSuggestedEntryMappingNotes(entry, cleanedJson, form) {
    const scopedEntry = {
      ...entry,
      categoryId: form?.categoryId?.value ? Number(form.categoryId.value) : entry?.categoryId || null,
      assignedRecordType: form?.assignedRecordType?.value || entry?.assignedRecordType || '',
      cleanedJson: cleanedJson || entry?.cleanedJson || {}
    };
    const existingMappings = entry?.mappedFieldsJson || {};
    const mappingNotes = { ...existingMappings };

    getSuggestedEntryMappings(scopedEntry).forEach((item) => {
      if (!mappingNotes[item.targetField]) {
        mappingNotes[item.targetField] = item.sourceLabel;
      }
    });

    const currentLabels = new Set(getEntryDisplayFields(scopedEntry, Infinity).map((field) => field.label));
    Object.keys(mappingNotes).forEach((fieldKey) => {
      if (currentLabels.has(mappingNotes[fieldKey])) {
        delete mappingNotes[fieldKey];
      }
    });

    form?.querySelectorAll('[data-field-mapping-label]').forEach((selectNode) => {
      const sourceLabel = selectNode.dataset.fieldMappingLabel;
      const targetField = selectNode.value;
      if (!sourceLabel || !targetField) {
        return;
      }
      mappingNotes[targetField] = sourceLabel;
    });

    return mappingNotes;
  }

  function buildMappingProfilePayload(entry, form, mappingNotes) {
    const profileName = String(form?.mappingProfileName?.value || '').trim();
    if (!profileName) {
      return null;
    }
    const scopedEntry = {
      ...entry,
      categoryId: form?.categoryId?.value ? Number(form.categoryId.value) : entry?.categoryId || null,
      assignedRecordType: form?.assignedRecordType?.value || entry?.assignedRecordType || '',
      cleanedJson: entry?.cleanedJson || {}
    };
    return {
      profileName,
      sourceType: 'excel',
      targetRecordType: form?.assignedRecordType?.value || inferEntryTargetType(scopedEntry) || 'project',
      mapping: {
        fields: mappingNotes,
        headerSignature: getEntryMappingProfileSignature(scopedEntry),
        categoryId: scopedEntry.categoryId || null,
        sourceSheetName: entry?.sourceSheetName || ''
      }
    };
  }

  function buildProfileMappingNotesForEntry(entry, profileId) {
    const profile = getBootstrapArray('mappingProfiles').find((item) => item.id === Number(profileId));
    if (!profile) {
      return null;
    }
    const fieldMap = getMappingProfileFieldMap(profile);
    const currentLabels = new Set(getEntryDisplayFields(entry, Infinity).map((field) => field.label));
    const mappingNotes = {};
    Object.entries(fieldMap).forEach(([targetField, sourceLabel]) => {
      if (targetField && currentLabels.has(sourceLabel)) {
        mappingNotes[targetField] = sourceLabel;
      }
    });
    return mappingNotes;
  }

  function buildSheetProfilePreview(profileId, rows) {
    const profile = getBootstrapArray('mappingProfiles').find((item) => item.id === Number(profileId));
    if (!profile) {
      return null;
    }

    const matchedLabels = new Set();
    const applicableRows = rows
      .map((entry) => {
        const mappingNotes = buildProfileMappingNotesForEntry(entry, profileId);
        if (!mappingNotes || !Object.keys(mappingNotes).length) {
          return null;
        }
        Object.values(mappingNotes).forEach((label) => {
          if (label) {
            matchedLabels.add(label);
          }
        });
        return {
          entry,
          mappingNotes
        };
      })
      .filter(Boolean);

    return {
      profile,
      totalRows: rows.length,
      matchedRows: applicableRows.length,
      unmatchedRows: Math.max(0, rows.length - applicableRows.length),
      matchedLabels: Array.from(matchedLabels).sort(),
      applicableRows
    };
  }

  function describeSheetProfilePreview(preview, sheetName) {
    if (!preview) {
      return 'Select a saved mapping profile to preview how many rows and field labels it can match in this sheet.';
    }
    if (!preview.matchedRows) {
      return `No rows in sheet "${sheetName || 'Current sheet'}" currently match this saved profile.`;
    }
    const labelList = preview.matchedLabels.length
      ? preview.matchedLabels.slice(0, 6).join(', ')
      : 'No shared labels detected';
    const extraCount = Math.max(0, preview.matchedLabels.length - 6);
    return `${preview.matchedRows} of ${preview.totalRows} row(s) in sheet "${sheetName || 'Current sheet'}" will receive mapping notes. Matching labels include ${labelList}${extraCount ? `, and ${extraCount} more` : ''}. ${preview.unmatchedRows ? `${preview.unmatchedRows} row(s) will be skipped because their labels do not match this profile.` : 'All visible rows have at least one matching label.'}`;
  }

  function updateExcelMappingProfilePreview(form, rows, sheetName) {
    const previewNode = form?.querySelector('#excelMappingProfilePreview');
    const originNode = form?.querySelector('#excelMappingProfileOrigin');
    const toggleButton = form?.querySelector('.toggle-mapping-profile-matches');
    if (!previewNode) {
      return null;
    }
    const profileId = Number(form.mappingProfileId?.value || 0);
    const profile = getBootstrapArray('mappingProfiles').find((item) => item.id === profileId) || null;
    const preview = profileId ? buildSheetProfilePreview(profileId, rows) : null;
    previewNode.textContent = describeSheetProfilePreview(preview, sheetName);
    if (originNode) {
      originNode.innerHTML = `${escapeHtml(describeMappingProfileOrigin(profile))}${profile ? `<br>${renderMappingProfileCompatibility(profile, form.categoryId?.value)} ${renderMappingProfileSheetBadge(profile, sheetName)}` : ''}`;
    }
    if (toggleButton) {
      if (!profileId || !preview?.matchedRows) {
        toggleButton.disabled = true;
        toggleButton.textContent = 'Review matching rows only';
      } else if (state.selectedExcelProfileMatchOnly) {
        toggleButton.disabled = false;
        toggleButton.textContent = `Show all sheet rows (${preview.totalRows})`;
      } else {
        toggleButton.disabled = false;
        toggleButton.textContent = `Review matching rows only (${preview.matchedRows})`;
      }
    }
    return preview;
  }

  function getExcelConsoleRowsForProfile(rows, profileId, matchOnly = false) {
    const preview = profileId ? buildSheetProfilePreview(profileId, rows) : null;
    if (!matchOnly || !preview?.matchedRows) {
      return {
        rows,
        preview
      };
    }
    return {
      rows: preview.applicableRows.map((item) => item.entry),
      preview
    };
  }

  function renderEntryProfileMatchSummary(entry, profileId) {
    if (!profileId) {
      return '';
    }
    const mappingNotes = buildProfileMappingNotesForEntry(entry, profileId);
    const labels = Object.values(mappingNotes || {}).filter(Boolean);
    if (!labels.length) {
      return '<p class="distribution-item-summary">No saved profile labels match this row yet.</p>';
    }
    return `
      <div class="meta-badges">
        ${labels.slice(0, 4).map((label) => badgeHtml(label)).join('')}
      </div>
      <p class="distribution-item-summary">Matched labels: ${escapeHtml(labels.join(', '))}.</p>
    `;
  }

  function applyMappingProfileToForm(form, profileId) {
    const profile = getBootstrapArray('mappingProfiles').find((item) => item.id === Number(profileId));
    if (!profile) {
      return false;
    }
    const mappingBySourceLabel = new Map(
      Object.entries(getMappingProfileFieldMap(profile))
        .map(([targetField, sourceLabel]) => [String(sourceLabel || ''), String(targetField || '')])
        .filter(([sourceLabel, targetField]) => sourceLabel && targetField)
    );
    form.querySelectorAll('[data-field-mapping-label]').forEach((selectNode) => {
      selectNode.value = mappingBySourceLabel.get(selectNode.dataset.fieldMappingLabel || '') || '';
    });
    return true;
  }

  async function applyMappingProfileToSheetRows(profileId, rows) {
    const profile = getBootstrapArray('mappingProfiles').find((item) => item.id === Number(profileId));
    if (!profile) {
      throw new Error('Selected mapping profile was not found.');
    }

    const applicableRows = rows
      .map((entry) => ({
        entry,
        mappingNotes: buildProfileMappingNotesForEntry(entry, profileId)
      }))
      .filter((item) => item.mappingNotes && Object.keys(item.mappingNotes).length);

    if (!applicableRows.length) {
      throw new Error('No rows in this sheet match the selected mapping profile.');
    }

    for (const item of applicableRows) {
      const inferredType = item.entry.assignedRecordType || profile.targetRecordType || inferEntryTargetType(item.entry) || '';
      await callApi('saveExtractedEntry', {
        id: item.entry.id,
        assignedRecordType: inferredType,
        status: item.entry.status || 'new',
        conversionStatus: item.entry.conversionStatus || 'not_converted',
        projectId: item.entry.projectId || null,
        beneficiaryId: item.entry.beneficiaryId || null,
        locationId: item.entry.locationId || null,
        categoryId: item.entry.categoryId || null,
        cleanedText: item.entry.cleanedText || item.entry.rawText || '',
        cleanedJson: item.entry.cleanedJson || {},
        mappedFieldsJson: {
          ...(item.entry.mappedFieldsJson || {}),
          ...item.mappingNotes
        },
        reviewNotes: item.entry.reviewNotes || '',
        tags: item.entry.tags || ''
      });
    }

    await refreshBootstrap();
    return applicableRows.length;
  }

  function buildConversionDefaults(targetType, entry, cleanedJson, form) {
    const schemaHints = getEntrySchemaHints({
      ...entry,
      categoryId: form?.categoryId?.value ? Number(form.categoryId.value) : entry?.categoryId || null
    });
    const inferredRecord = cleanedJson || entry?.cleanedJson || entry?.rawJson || {};
    const categoryId = form?.categoryId?.value ? Number(form.categoryId.value) : (entry?.categoryId || null);
    const category = getCategoryById(categoryId);
    const textBlob = JSON.stringify(inferredRecord);
    const categoryLabel = category?.name || 'Environmental Record';
    const titleContext = inferredRecord.projectTitle
      || inferredRecord.projectName
      || inferredRecord.name
      || inferredRecord.schoolName
      || inferredRecord.householdName
      || inferredRecord.institutionName
      || inferredRecord.household
      || inferredRecord.beneficiary
      || inferredRecord.location
      || inferredRecord.village
      || inferredRecord.waterSourceType
      || inferredRecord.sessionTopic
      || '';
    const defaults = {
      categoryId,
      projectId: form?.projectId?.value ? Number(form.projectId.value) : (entry?.projectId || null),
      beneficiaryId: form?.beneficiaryId?.value ? Number(form.beneficiaryId.value) : (entry?.beneficiaryId || null),
      locationId: form?.locationId?.value ? Number(form.locationId.value) : (entry?.locationId || null),
      tags: form?.tags?.value || entry?.tags || ''
    };

    if (targetType === 'project') {
      defaults.projectStatus = category?.name === 'Community Training' ? 'active' : (entry?.status === 'reviewed' ? 'planned' : 'draft');
      defaults.projectTitle = titleContext
        ? `${categoryLabel} - ${titleContext}`
        : categoryLabel;
    } else if (targetType === 'beneficiary') {
      defaults.beneficiaryType = /school/i.test(textBlob) || category?.name === 'School Programme' ? 'school'
        : /institution/i.test(textBlob) || category?.name === 'Biogas Installation' ? 'institution'
          : /household/i.test(textBlob) || ['Energy-saving Cookstoves', 'Biogas Installation'].includes(category?.name || '') ? 'household'
            : /group|community|club/i.test(textBlob) || ['Fish Farming', 'Community Training'].includes(category?.name || '') ? 'group'
              : 'community';
      defaults.beneficiaryName = inferredRecord.beneficiary
        || inferredRecord.householdName
        || inferredRecord.institutionName
        || inferredRecord.schoolName
        || inferredRecord.pondOwner
        || inferredRecord.name
        || '';
    } else if (targetType === 'location') {
      defaults.locationType = /school/i.test(textBlob) || category?.name === 'School Programme' ? 'school'
        : /farm/i.test(textBlob) ? 'farm'
          : /household/i.test(textBlob) ? 'household'
            : /pond/i.test(textBlob) || category?.name === 'Fish Farming' ? 'fish_pond_site'
              : /spring|water/i.test(textBlob) || category?.name === 'Water Project' ? 'water_site'
                : /restoration|erosion/i.test(textBlob) || category?.name === 'Environmental Restoration' ? 'restoration_site'
                  : /training/i.test(textBlob) || category?.name === 'Community Training' ? 'training_venue'
                    : /tree/i.test(textBlob) || ['Tree Planting', 'Seedling Distribution'].includes(category?.name || '') ? 'tree_planting_site'
                      : 'community';
      defaults.locationName = inferredRecord.location
        || inferredRecord.village
        || inferredRecord.waterSourceType
        || inferredRecord.schoolName
        || inferredRecord.institutionName
        || inferredRecord.householdName
        || inferredRecord.name
        || categoryLabel;
    } else if (targetType === 'activity') {
      defaults.activityType = schemaHints.suggestedActivityType || inferredRecord.activityType || inferredRecord.projectType || 'general_activity';
      defaults.activityTitle = inferredRecord.activityTitle
        || (titleContext ? `${humanise(defaults.activityType)} - ${titleContext}` : '')
        || inferredRecord.activityType
        || inferredRecord.projectType
        || inferredRecord.name
        || '';
    }

    return defaults;
  }

  function syncActivityTypeFromCategory(force = false) {
    const form = byId('activityForm');
    if (!form) {
      return;
    }
    const categoryId = getFormField(form, 'categoryId')?.value || '';
    const activityField = getFormField(form, 'activityType');
    const suggestedType = getPreferredActivityTypeByCategory(categoryId);
    const autoAssigned = activityField.dataset.autoAssigned === 'true';
    if (!suggestedType) {
      if (!activityField.value) {
        activityField.dataset.autoAssigned = 'false';
      }
      return;
    }
    if (force || !activityField.value || autoAssigned) {
      activityField.value = suggestedType;
      activityField.dataset.autoAssigned = 'true';
      renderFormIntelligence('activity');
    }
  }

  function renderEntryIntelligencePanel(entry) {
    const schemaHints = getEntrySchemaHints(entry);
    const linkedProject = entry.projectId ? getProjectById(entry.projectId) : null;
    const linkedBeneficiary = entry.beneficiaryId ? getBeneficiaryById(entry.beneficiaryId) : null;
    const linkedLocation = entry.locationId ? getLocationById(entry.locationId) : null;
    const coverage = getRelationCoverageScore({
      assignedType: !!entry.assignedRecordType,
      project: !!linkedProject,
      beneficiary: !!linkedBeneficiary,
      location: !!linkedLocation,
      category: !!entry.categoryId
    });
    const signals = [buildCoverageBadge(coverage), humanise(entry.sourceType || 'entry'), `Suggest ${humanise(schemaHints.suggestedTarget)}`];
    const actions = [];
    const warnings = [];
    if (linkedProject) {
      const projectContext = getNamedProjectContext(linkedProject.id);
      actions.push(`Project context suggests beneficiaries ${formatLimitedList(projectContext.beneficiaryNames)} and locations ${formatLimitedList(projectContext.locationNames)}.`);
    }
    if (schemaHints.canonicalFields.length) {
      actions.push(`This category usually cares about fields such as ${formatLimitedList(schemaHints.canonicalFields.map((field) => humanise(field)), 4)}.`);
    }
    if (!entry.assignedRecordType) {
      warnings.push('Assigned record type is still empty, so conversion intent is not explicit yet.');
    }
    if (!entry.projectId && !entry.beneficiaryId && !entry.locationId) {
      warnings.push('This extracted record has no core links yet and may become harder to recover later.');
    }
    return renderIntelligencePanel(
      'Review intelligence',
      'The editor keeps raw extraction intact while checking whether the working copy is linked deeply enough for safe conversion.',
      signals,
      actions,
      warnings
    );
  }

  function categorySupportsSeedlingOutcomes(categoryId) {
    const category = getCategoryById(categoryId);
    return !!(category && ['Tree Planting', 'Seedling Distribution'].includes(category.name));
  }

  function syncProjectCategorySpecificVisibility(categoryId) {
    const seedlingGroup = byId('projectSeedlingFields');
    if (!seedlingGroup) {
      return;
    }
    const showSeedlingFields = categorySupportsSeedlingOutcomes(categoryId);
    seedlingGroup.classList.toggle('hidden', !showSeedlingFields);
    seedlingGroup.querySelectorAll('input, textarea, select').forEach((field) => {
      field.disabled = !showSeedlingFields;
    });
  }

  function renderProjectCategoryFields(categoryId, currentValues = {}) {
    const helper = byId('projectCategoryFieldHelper');
    const target = byId('projectCategoryFieldInputs');
    if (!helper || !target) {
      return;
    }

    syncProjectCategorySpecificVisibility(categoryId);
    renderDistributedItemsPanel('project', collectDistributedItems('project', true));
    byId('projectForm')?.querySelectorAll('[data-admin-custom-field-wrapper]').forEach((node) => node.remove());

    const profile = getProjectCategoryProfile(categoryId);
    const matchingCustomFields = getBootstrapArray('customFields').filter((item) => (item.entityType || 'project') === 'project' && (!item.categoryId || item.categoryId === Number(categoryId)));

    if (!profile) {
      helper.textContent = 'Select a project category to load tailored field guidance and category-specific capture inputs.';
      target.innerHTML = '';
      injectProjectCustomFields(matchingCustomFields, currentValues);
      return;
    }

    helper.innerHTML = `
      <strong>${escapeHtml(getCategoryById(categoryId).name)} field guidance</strong><br>
      ${escapeHtml(profile.summary)}
      ${matchingCustomFields.length ? `<br><br>Saved admin custom fields available for this category: ${escapeHtml(matchingCustomFields.map((item) => item.fieldName).join(', '))}` : ''}
      <br><br>These category inputs are saved into the project's structured custom data JSON automatically.
    `;
    target.innerHTML = `
      <div class="form-grid compact-grid">
        ${profile.fields.map((field) => renderProjectStructuredField(field, currentValues)).join('')}
      </div>
    `;
    injectProjectCustomFields(matchingCustomFields, currentValues);
  }

  function collectProjectCategoryFieldData() {
    const data = {};
    byId('projectForm')?.querySelectorAll('[data-project-structured-field]').forEach((field) => {
      const key = field.dataset.projectStructuredField;
      const type = field.dataset.fieldType;
      const value = field.value;
      if (value === '') {
        return;
      }
      data[key] = type === 'number' ? Number(value) : value;
    });
    return data;
  }

  function renderProjectStructuredField(field, currentValues = {}, dataAttribute = 'data-project-structured-field', wrapperAttribute = '') {
    const fieldValue = currentValues && currentValues[field.key] !== undefined ? currentValues[field.key] : '';
    const extraWrapper = wrapperAttribute ? ` ${wrapperAttribute}` : '';
    if (field.type === 'boolean') {
      return `<label${extraWrapper} class="checkbox-field"><span>${escapeHtml(field.label)}</span><input type="checkbox" ${dataAttribute}="${escapeHtml(field.key)}" data-field-type="${escapeHtml(field.type)}" ${fieldValue ? 'checked' : ''}></label>`;
    }
    if (field.type === 'textarea') {
      return `<label${extraWrapper}><span>${escapeHtml(field.label)}</span><textarea ${dataAttribute}="${escapeHtml(field.key)}" data-field-type="${escapeHtml(field.type)}" rows="3">${escapeHtml(fieldValue)}</textarea></label>`;
    }
    const inputType = field.type === 'select' ? 'text' : field.type;
    return `<label${extraWrapper}><span>${escapeHtml(field.label)}</span><input type="${escapeHtml(inputType)}" ${dataAttribute}="${escapeHtml(field.key)}" data-field-type="${escapeHtml(field.type)}" value="${escapeHtml(fieldValue)}"></label>`;
  }

  function injectProjectCustomFields(customFields, currentValues = {}) {
    const form = byId('projectForm');
    if (!form) {
      return;
    }
    const fallbackAnchor = getFormField(form, 'customData')?.closest('label');
    (customFields || []).forEach((field) => {
      const wrapper = document.createElement('div');
      wrapper.className = `project-custom-field-slot${field.fieldType === 'textarea' ? ' full-span' : ''}`;
      wrapper.dataset.adminCustomFieldWrapper = String(field.id || field.fieldKey || '');
      wrapper.innerHTML = renderProjectStructuredField({
        key: field.fieldKey,
        label: field.fieldName,
        type: field.fieldType
      }, currentValues, 'data-project-structured-field');
      const anchorField = field.insertAfterField ? getFormField(form, field.insertAfterField) : null;
      const anchor = anchorField ? anchorField.closest('label, div.full-span, div.form-actions') : fallbackAnchor;
      if (anchor && anchor.parentNode) {
        anchor.parentNode.insertBefore(wrapper, anchor.nextSibling);
      } else if (fallbackAnchor && fallbackAnchor.parentNode) {
        fallbackAnchor.parentNode.insertBefore(wrapper, fallbackAnchor);
      } else {
        form.appendChild(wrapper);
      }
    });
  }

  function collectCustomFieldNodeValue(field) {
    if (!field) {
      return '';
    }
    if (field.dataset.fieldType === 'boolean') {
      return field.checked;
    }
    return field.value;
  }

  function collectGenericCustomFieldData(entityType) {
    const config = getCustomFieldFormConfig(entityType);
    const form = config ? byId(config.formId) : null;
    if (!form) {
      return {};
    }
    const data = {};
    form.querySelectorAll('[data-admin-custom-field]').forEach((field) => {
      const key = field.dataset.adminCustomField;
      const type = field.dataset.fieldType;
      const value = collectCustomFieldNodeValue(field);
      if (type !== 'boolean' && value === '') {
        return;
      }
      data[key] = type === 'number' && value !== '' ? Number(value) : value;
    });
    return data;
  }

  function injectEntityCustomFields(entityType, currentValues = {}) {
    const config = getCustomFieldFormConfig(entityType);
    const form = config ? byId(config.formId) : null;
    if (!form || entityType === 'project') {
      return;
    }
    form.querySelectorAll('[data-admin-custom-field-wrapper]').forEach((node) => node.remove());
    const categoryField = config.categoryFieldName ? getFormField(form, config.categoryFieldName) : null;
    const selectedCategoryId = categoryField ? Number(categoryField.value || 0) : 0;
    const matchingCustomFields = getBootstrapArray('customFields').filter((field) => {
      if ((field.entityType || 'project') !== entityType) {
        return false;
      }
      if (!field.categoryId) {
        return true;
      }
      return Number(field.categoryId) === selectedCategoryId;
    });
    const fallbackField = getFormField(form, config.fallbackFieldName);
    const fallbackAnchor = fallbackField ? fallbackField.closest('label, div.full-span, div.form-actions') : form.querySelector('.form-actions');
    matchingCustomFields.forEach((field) => {
      const wrapper = document.createElement('div');
      wrapper.className = `project-custom-field-slot${field.fieldType === 'textarea' ? ' full-span' : ''}`;
      wrapper.dataset.adminCustomFieldWrapper = String(field.id || field.fieldKey || '');
      wrapper.innerHTML = renderProjectStructuredField({
        key: field.fieldKey,
        label: field.fieldName,
        type: field.fieldType
      }, currentValues, 'data-admin-custom-field');
      const anchorField = field.insertAfterField ? getFormField(form, field.insertAfterField) : null;
      const anchor = anchorField ? anchorField.closest('label, div.full-span, div.form-actions') : fallbackAnchor;
      if (anchor && anchor.parentNode) {
        anchor.parentNode.insertBefore(wrapper, anchor.nextSibling);
      } else {
        form.appendChild(wrapper);
      }
    });
  }

  function renderAllEntityCustomFields() {
    renderProjectCategoryFields(byId('projectCategorySelect')?.value || '', getFormCustomData('project'));
    Object.keys(CUSTOM_FIELD_FORM_CONFIG).forEach((entityType) => {
      if (entityType === 'project') {
        return;
      }
      injectEntityCustomFields(entityType, getFormCustomData(entityType));
    });
  }

  function bindAutoFilterForm(formId, onSubmit) {
    const form = byId(formId);
    if (!form) {
      return;
    }
    const trigger = debounce(() => form.requestSubmit(), 240);
    form.querySelectorAll('input, select').forEach((field) => {
      if (field.type === 'file') {
        return;
      }
      const eventName = field.tagName === 'SELECT' ? 'change' : 'input';
      field.addEventListener(eventName, trigger);
    });
    form.addEventListener('submit', onSubmit);
  }

  function mapLink(coordinates) {
    if (!coordinates.latitude || !coordinates.longitude) {
      return '';
    }
    return `https://maps.google.com/?q=${encodeURIComponent(`${coordinates.latitude},${coordinates.longitude}`)}`;
  }

  function splitTags(tagText) {
    return String(tagText || '')
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);
  }

  function hasTag(item, tag) {
    return splitTags(item && item.tags).includes(String(tag || '').toLowerCase());
  }

  function pickTaggedPhoto(items, primaryTag) {
    return items.find((item) => hasTag(item, primaryTag)) || items[0] || null;
  }

  function pickTaggedDocument(items, primaryTag) {
    return items.find((item) => hasTag(item, primaryTag)) || items[0] || null;
  }

  function getEntityLinkValues(entityType, entityRecord) {
    if (entityType === 'project') {
      return { projectId: entityRecord.id, relatedProjectId: entityRecord.id, title: entityRecord.title };
    }
    if (entityType === 'beneficiary') {
      return { beneficiaryId: entityRecord.id, title: entityRecord.name };
    }
    if (entityType === 'location') {
      return { locationId: entityRecord.id, title: entityRecord.name };
    }
    return { activityId: entityRecord.id, title: entityRecord.title };
  }

  async function uploadEntityMediaFiles(entityType, entityRecord, form) {
    const profilePhotoFiles = getSelectedUploadFiles(form, 'profilePhotoFile');
    const referenceDocumentFiles = getSelectedUploadFiles(form, 'referenceDocumentFile');
    const evidenceImageFiles = getSelectedUploadFiles(form, 'evidenceImageFile');
    if (!profilePhotoFiles.length && !referenceDocumentFiles.length && !evidenceImageFiles.length) {
      return;
    }

    const links = getEntityLinkValues(entityType, entityRecord);
    const subject = links.title || 'Entity';
    const profileRoleLabel = entityType === 'beneficiary' ? 'profile photo' : 'cover image';
    const documentRoleTag = entityType === 'beneficiary' ? 'identity_document' : 'reference_document';
    const documentRoleLabel = entityType === 'beneficiary' ? 'identity document' : 'reference document';

    for (const profilePhotoFile of profilePhotoFiles) {
      await callApi('uploadPhoto', {
        filePath: profilePhotoFile.path,
        mimeType: profilePhotoFile.type,
        title: `${subject} ${profileRoleLabel}`,
        category: 'general_evidence',
        projectId: links.projectId || null,
        beneficiaryId: links.beneficiaryId || null,
        locationId: links.locationId || null,
        activityId: links.activityId || null,
        description: `${profileRoleLabel} for ${subject}.`,
        tags: `profile_photo,featured_media,${entityType}_profile`
      });
    }

    for (const referenceDocumentFile of referenceDocumentFiles) {
      await callApi('uploadDocument', {
        filePath: referenceDocumentFile.path,
        mimeType: referenceDocumentFile.type,
        relatedProjectId: links.relatedProjectId || null,
        beneficiaryId: links.beneficiaryId || null,
        locationId: links.locationId || null,
        activityId: links.activityId || null,
        description: `${documentRoleLabel} for ${subject}.`,
        tags: `${documentRoleTag},featured_reference,${entityType}_reference`
      });
    }

    for (const evidenceImageFile of evidenceImageFiles) {
      await callApi('uploadPhoto', {
        filePath: evidenceImageFile.path,
        mimeType: evidenceImageFile.type,
        title: `${subject} evidence image`,
        category: 'general_evidence',
        projectId: links.projectId || null,
        beneficiaryId: links.beneficiaryId || null,
        locationId: links.locationId || null,
        activityId: links.activityId || null,
        description: `Additional evidence image for ${subject}.`,
        tags: `evidence,${entityType}_evidence`
      });
    }
  }

  function renderEmptyState(target, text) {
    target.innerHTML = `<div class="empty-state">${escapeHtml(text)}</div>`;
  }

  function badgeToneForValue(value) {
    const normalised = String(value || '').toLowerCase();
    if (!normalised) {
      return '';
    }
    if (['failed', 'rejected', 'inactive'].includes(normalised)) {
      return 'danger';
    }
    if (['active', 'completed', 'verified', 'converted', 'extracted'].includes(normalised)) {
      return 'success';
    }
    if (['follow_up_required', 'needs_manual_review', 'pending_review', 'partially_extracted'].includes(normalised)) {
      return 'warning';
    }
    if (['draft', 'planned', 'imported', 'new', 'not_converted', 'archived'].includes(normalised)) {
      return 'muted';
    }
    return '';
  }

  function badgeHtml(text, tone) {
    return `<span class="badge ${tone || badgeToneForValue(text)}">${escapeHtml(humanise(text))}</span>`;
  }

  function formatPathForDisplay(filePath) {
    const value = String(filePath || '');
    if (value.length <= 56) {
      return value;
    }
    return `...${value.slice(-56)}`;
  }

  function renderMetricList(target, rows) {
    if (!target) {
      return;
    }
    if (!rows.length) {
      renderEmptyState(target, 'No summary data yet.');
      return;
    }
    target.innerHTML = rows.map((row) => `
      <div class="metric-item">
        <span>${escapeHtml(row.label)}</span>
        <strong>${escapeHtml(row.value)}</strong>
      </div>
    `).join('');
  }

  function resetCategoryForm() {
    const form = byId('categoryForm');
    if (!form) {
      return;
    }
    form.reset();
    const idField = getFormField(form, 'id');
    if (idField) {
      idField.value = '';
    }
    setFormCustomData('category', {});
    injectEntityCustomFields('category', {});
  }

  function populateCategoryForm(category) {
    const form = byId('categoryForm');
    if (!form || !category) {
      return;
    }
    getFormField(form, 'id').value = category.id || '';
    getFormField(form, 'name').value = category.name || '';
    getFormField(form, 'description').value = category.description || '';
    setFormCustomData('category', category.customData || {});
    injectEntityCustomFields('category', category.customData || {});
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderCategories() {
    const target = byId('categoriesTable');
    if (!target) {
      return;
    }
    renderTable(target, [
      { label: 'Category', render: (row) => `<strong>${escapeHtml(row.name)}</strong>` },
      { label: 'Description', render: (row) => escapeHtml(row.description || 'Not recorded') },
      { label: 'Created', render: (row) => escapeHtml(formatDateTime(row.createdAt)) }
    ], getBootstrapArray('categories'), (row) => [
      `<button type="button" class="inline-button category-open" data-id="${row.id}">Open</button>`,
      `<button type="button" class="inline-button category-edit" data-id="${row.id}">Edit</button>`,
      `<button type="button" class="inline-button category-delete" data-id="${row.id}">Delete</button>`
    ], 'No project categories saved yet.');
    bindActionButtons(target, {
      '.category-open': (event) => {
        openEntity('project_category', Number(event.currentTarget.dataset.id));
      },
      '.category-edit': (event) => {
        const category = getCategoryById(Number(event.currentTarget.dataset.id));
        if (category) {
          populateCategoryForm(category);
        }
      },
      '.category-delete': async (event) => {
        const categoryId = Number(event.currentTarget.dataset.id);
        const category = getCategoryById(categoryId);
        if (!category || !window.confirm(`Delete category "${category.name}"?`)) {
          return;
        }
        await performAction(() => window.environmentApp.deleteCategory(categoryId), 'Category removed.');
        if (String(getFormField(byId('categoryForm'), 'id')?.value || '') === String(categoryId)) {
          resetCategoryForm();
        }
      }
    });
  }

  function resetCustomFieldForm() {
    const form = byId('customFieldForm');
    if (!form) {
      return;
    }
    form.reset();
    getFormField(form, 'id').value = '';
    getFormField(form, 'entityType').value = 'project';
    fillSelect(byId('customFieldInsertAfterSelect'), getCustomFieldInsertOptions('project'), 'End of selected form');
    syncCustomFieldCategoryAvailability('project');
    const submitButton = byId('customFieldSubmitButton');
    if (submitButton) {
      submitButton.textContent = 'Save custom field';
    }
  }

  function populateCustomFieldForm(customField) {
    const form = byId('customFieldForm');
    if (!form || !customField) {
      return;
    }
    getFormField(form, 'id').value = customField.id || '';
    getFormField(form, 'entityType').value = customField.entityType || 'project';
    getFormField(form, 'categoryId').value = customField.categoryId || '';
    getFormField(form, 'fieldName').value = customField.fieldName || '';
    getFormField(form, 'fieldKey').value = customField.fieldKey || '';
    getFormField(form, 'fieldType').value = customField.fieldType || 'text';
    fillSelect(byId('customFieldInsertAfterSelect'), getCustomFieldInsertOptions(customField.entityType || 'project'), 'End of selected form');
    syncCustomFieldCategoryAvailability(customField.entityType || 'project');
    getFormField(form, 'insertAfterField').value = customField.insertAfterField || '';
    const submitButton = byId('customFieldSubmitButton');
    if (submitButton) {
      submitButton.textContent = 'Save custom field changes';
    }
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderCustomFieldManager(rows) {
    const target = byId('customFieldsList');
    if (!target) {
      return;
    }
    if (!rows.length) {
      renderEmptyState(target, 'No custom fields saved yet.');
      return;
    }
    target.innerHTML = rows.map((item) => `
      <div class="metric-item custom-field-manager-row">
        <span>${escapeHtml(`${humanise(item.entityType || 'project')} · ${item.categoryName || 'All categories'} · ${item.fieldName}`)}</span>
        <strong>${escapeHtml(`${item.fieldKey} (${item.fieldType})`)}</strong>
        <small>${escapeHtml(`Insert after: ${getCustomFieldInsertOptions(item.entityType || 'project').find((option) => option.value === item.insertAfterField)?.label || 'End of selected form'}`)}</small>
        <div class="photo-card-actions">
          <button type="button" class="inline-button custom-field-edit" data-id="${item.id}">Edit</button>
          <button type="button" class="inline-button custom-field-delete" data-id="${item.id}">Remove</button>
        </div>
      </div>
    `).join('');
    bindActionButtons(target, {
      '.custom-field-edit': (event) => {
        const customField = getCustomFieldById(Number(event.currentTarget.dataset.id));
        if (customField) {
          populateCustomFieldForm(customField);
        }
      },
      '.custom-field-delete': async (event) => {
        const customFieldId = Number(event.currentTarget.dataset.id);
        const customField = getCustomFieldById(customFieldId);
        if (!customField || !window.confirm(`Remove custom field "${customField.fieldName}" from the ${humanise(customField.entityType || 'project')} form?`)) {
          return;
        }
        await performAction(() => window.environmentApp.deleteCustomField(customFieldId), 'Custom field removed.');
        if (String(getFormField(byId('customFieldForm'), 'id').value || '') === String(customFieldId)) {
          resetCustomFieldForm();
        }
        renderAllEntityCustomFields();
      }
    });
  }

  function syncCustomFieldCategoryAvailability(entityType) {
    const form = byId('customFieldForm');
    if (!form) {
      return;
    }
    const categoryField = getFormField(form, 'categoryId');
    if (!categoryField) {
      return;
    }
    const config = getCustomFieldFormConfig(entityType);
    const supportsCategoryScopedFields = !!(config && config.categoryFieldName);
    categoryField.disabled = !supportsCategoryScopedFields;
    if (!supportsCategoryScopedFields) {
      categoryField.value = '';
    }
  }

  function renderTimelineItems(target, items) {
    if (!target) {
      return;
    }
    if (!items.length) {
      renderEmptyState(target, 'No timeline entries yet.');
      return;
    }
    const tableKey = getTableKey(target);
    const pageSize = target.id === 'recentTimeline'
      ? 1
      : target.id === 'timelineList'
        ? 8
        : items.length;
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    const currentPage = Math.min(state.tablePaging[tableKey] || 1, totalPages);
    setTablePage(tableKey, currentPage);
    const visibleItems = items.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    state.tableRenderers[tableKey] = () => renderTimelineItems(target, items);
    target.innerHTML = visibleItems.map((item) => `
      <div class="timeline-item">
        <div class="timeline-date">${escapeHtml(formatDate(item.entryDate || item.createdAt))}</div>
        <div class="timeline-body">
          <strong>${escapeHtml(item.title)}</strong>
          <p>${escapeHtml(item.description || '')}</p>
          <div class="timeline-meta">
            ${badgeHtml(item.entryType)}
            ${item.projectTitle ? `<span>${escapeHtml(item.projectTitle)}</span>` : ''}
            ${item.locationName ? `<span>${escapeHtml(item.locationName)}</span>` : ''}
            ${item.beneficiaryName ? `<span>${escapeHtml(item.beneficiaryName)}</span>` : ''}
          </div>
          <div class="timeline-actions">
            <button type="button" class="entity-deep-link" data-entity-type="timeline" data-entity-id="${item.id}">Open event page</button>
            ${item.projectId ? `<button type="button" class="entity-deep-link" data-entity-type="project" data-entity-id="${item.projectId}">Project page</button>` : ''}
            ${item.beneficiaryId ? `<button type="button" class="entity-deep-link" data-entity-type="beneficiary" data-entity-id="${item.beneficiaryId}">Beneficiary page</button>` : ''}
            ${item.locationId ? `<button type="button" class="entity-deep-link" data-entity-type="location" data-entity-id="${item.locationId}">Location page</button>` : ''}
          </div>
        </div>
      </div>
    `).join('') + renderPaginationControls(tableKey, currentPage, totalPages, items.length, pageSize);
    bindEntityActions(target);
    bindPaginationButtons(target, tableKey, currentPage);
  }

  function renderSummaryCards() {
    const dashboard = state.bootstrap.dashboard;
    const cards = [
      ['Projects', dashboard.totalProjects],
      ['Duties', dashboard.totalDuties],
      ['Beneficiaries', dashboard.totalBeneficiaries],
      ['Locations', dashboard.totalLocations],
      ['Documents', dashboard.totalDocuments],
      ['Photos', dashboard.totalPhotos],
      ['Excel imports', dashboard.totalExcelImports],
      ['Extracted rows', dashboard.totalEntries],
      ['Unreviewed rows', dashboard.unreviewedEntries],
      ['Converted rows', dashboard.convertedEntries],
      ['Follow-up required', dashboard.followUpRequired],
      ['Pending duties', dashboard.pendingDuties],
      ['Active projects', dashboard.activeProjects],
      ['Completed projects', dashboard.completedProjects]
    ];
    byId('dashboardCards').innerHTML = cards.map(([label, value]) => `
      <div class="summary-card">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(value)}</strong>
      </div>
    `).join('');
  }

  function buildDashboardActionCard(config) {
    const actionButton = config.entityType
      ? `<button type="button" class="primary-button entity-link-action" data-entity-type="${escapeHtml(config.entityType)}" data-entity-id="${escapeHtml(encodeEntityId(config.entityType, config.entityId))}">${escapeHtml(config.actionLabel || 'Open page')}</button>`
      : `<button type="button" class="primary-button entity-link-action" data-open-section="${escapeHtml(config.sectionId || 'dashboardSection')}" data-section-title="${escapeHtml(config.sectionTitle || config.title || 'Open section')}">${escapeHtml(config.actionLabel || 'Open section')}</button>`;
    return `
      <article class="dashboard-action-card ${escapeHtml(config.tone || 'neutral')}">
        <div class="dashboard-action-card-head">
          <div>
            <p class="eyebrow">${escapeHtml(config.eyebrow || 'Suggested action')}</p>
            <h3>${escapeHtml(config.title)}</h3>
          </div>
          <div class="meta-badges">${(config.badges || []).filter(Boolean).map((badge) => badgeHtml(badge)).join('')}</div>
        </div>
        <p>${escapeHtml(config.description || '')}</p>
        ${(config.metrics || []).length ? `
          <div class="dashboard-action-metrics">
            ${(config.metrics || []).map((metric) => `
              <div class="dashboard-action-metric">
                <span>${escapeHtml(metric.label)}</span>
                <strong>${escapeHtml(metric.value)}</strong>
              </div>
            `).join('')}
          </div>
        ` : ''}
        <div class="dashboard-action-footer">
          ${actionButton}
        </div>
      </article>
    `;
  }

  function buildGraphBarRows(rows) {
    const values = rows.map((row) => Number(row.value || 0));
    const maxValue = Math.max(1, ...values);
    return `
      <div class="dashboard-graph-list">
        ${rows.map((row) => {
          const value = Number(row.value || 0);
          const width = Math.max(4, Math.round((value / maxValue) * 100));
          return `
            <div class="dashboard-graph-row">
              <div class="dashboard-graph-row-label">
                <span>${escapeHtml(row.label)}</span>
                <strong>${escapeHtml(value)}</strong>
              </div>
              <div class="dashboard-graph-track">
                <div class="dashboard-graph-fill" style="width:${width}%"></div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  function buildSparkline(values) {
    const safeValues = values.length ? values : [0];
    const maxValue = Math.max(1, ...safeValues);
    const step = safeValues.length > 1 ? 100 / (safeValues.length - 1) : 100;
    const points = safeValues.map((value, index) => {
      const x = safeValues.length === 1 ? 50 : index * step;
      const y = 52 - ((Number(value || 0) / maxValue) * 40);
      return `${x},${y}`;
    }).join(' ');
    return `
      <svg viewBox="0 0 100 56" class="dashboard-sparkline" preserveAspectRatio="none" aria-hidden="true">
        <polyline points="${points}" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></polyline>
      </svg>
    `;
  }

  function buildDashboardChartCard(config) {
    return `
      <article class="dashboard-chart-card">
        <div class="dashboard-chart-head">
          <div>
            <p class="eyebrow">${escapeHtml(config.eyebrow || 'Dashboard graph')}</p>
            <h3>${escapeHtml(config.title)}</h3>
          </div>
          <div class="meta-badges">${(config.badges || []).filter(Boolean).map((badge) => badgeHtml(badge, 'muted')).join('')}</div>
        </div>
        <p>${escapeHtml(config.description || '')}</p>
        ${config.sparkline ? `<div class="dashboard-sparkline-shell">${config.sparkline}</div>` : ''}
        ${config.bodyHtml || ''}
        <div class="dashboard-action-footer">
          <button type="button" class="secondary-button entity-link-action" data-open-section="${escapeHtml(config.sectionId || 'dashboardSection')}" data-section-title="${escapeHtml(config.sectionTitle || config.title || 'Open section')}">${escapeHtml(config.actionLabel || 'Open section')}</button>
        </div>
      </article>
    `;
  }

  function getTimelineMonthSeries(entries, monthCount = 6) {
    const now = new Date();
    const buckets = [];
    for (let offset = monthCount - 1; offset >= 0; offset -= 1) {
      const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1));
      const key = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
      buckets.push({
        key,
        label: date.toLocaleString('en-GB', { month: 'short', year: '2-digit', timeZone: 'UTC' }),
        value: 0
      });
    }
    (entries || []).forEach((entry) => {
      const iso = String(entry.entryDate || entry.createdAt || '');
      const key = iso.slice(0, 7);
      const bucket = buckets.find((item) => item.key === key);
      if (bucket) {
        bucket.value += 1;
      }
    });
    return buckets;
  }

  function renderDashboardFocusActions() {
    const dashboard = state.bootstrap.dashboard || {};
    const categories = getBootstrapArray('categories');
    const actions = [];
    if (!categories.length) {
      actions.push({
        tone: 'warning',
        eyebrow: 'Foundation priority',
        title: 'Review and organise project categories',
        description: 'Project categories shape project forms, custom field intelligence, and cleaner reporting. Keep them current so records stay consistent.',
        sectionId: 'categoriesSection',
        sectionTitle: 'Project Categories',
        actionLabel: 'Open project categories',
        badges: ['high priority'],
        metrics: [{ label: 'Saved categories', value: categories.length }]
      });
    }
    if (dashboard.unreviewedEntries > 0) {
      actions.push({
        tone: 'warning',
        eyebrow: 'Data review priority',
        title: 'Review extracted rows waiting for confirmation',
        description: 'Imported spreadsheet or document rows are waiting to be checked, linked, converted, or rejected before they become trusted operational records.',
        sectionId: 'excelSection',
        sectionTitle: 'Excel Imports',
        actionLabel: 'Open imports and extracted rows',
        badges: ['review queue'],
        metrics: [{ label: 'Unreviewed rows', value: dashboard.unreviewedEntries }, { label: 'Converted rows', value: dashboard.convertedEntries || 0 }]
      });
    }
    if (dashboard.pendingDuties > 0) {
      actions.push({
        tone: 'accent',
        eyebrow: 'Operations priority',
        title: 'Follow up pending duties and assignments',
        description: 'Pending duties can hide stalled field work, missing verification, or delayed evidence capture. Keep the assignment thread moving.',
        sectionId: 'dutiesSection',
        sectionTitle: 'Duties',
        actionLabel: 'Open duties register',
        badges: ['operations'],
        metrics: [{ label: 'Pending duties', value: dashboard.pendingDuties }, { label: 'Total duties', value: dashboard.totalDuties || 0 }]
      });
    }
    if (dashboard.followUpRequired > 0) {
      actions.push({
        tone: 'warning',
        eyebrow: 'Field readiness',
        title: 'Check projects needing follow-up',
        description: 'These projects are signalling that the story is not complete yet. Review progress, evidence, and next visits before they drift out of view.',
        sectionId: 'projectsSection',
        sectionTitle: 'Projects',
        actionLabel: 'Open project register',
        badges: ['follow-up'],
        metrics: [{ label: 'Projects needing follow-up', value: dashboard.followUpRequired }, { label: 'Active projects', value: dashboard.activeProjects || 0 }]
      });
    }
    if ((dashboard.totalDocuments || 0) > (dashboard.totalEntries || 0)) {
      actions.push({
        tone: 'neutral',
        eyebrow: 'Evidence quality',
        title: 'Link more evidence into retrievable records',
        description: 'There are more saved documents than extracted rows. Review whether uploaded evidence should be linked, extracted, or annotated more deeply.',
        sectionId: 'documentsSection',
        sectionTitle: 'Documents',
        actionLabel: 'Open documents register',
        badges: ['evidence'],
        metrics: [{ label: 'Documents', value: dashboard.totalDocuments || 0 }, { label: 'Extracted rows', value: dashboard.totalEntries || 0 }]
      });
    }
    if (!actions.length) {
      actions.push({
        tone: 'success',
        eyebrow: 'Smooth running',
        title: 'Operational records look well balanced',
        description: 'The main queues are under control. Use the sections below to inspect growth, evidence quality, and new activity entering the system.',
        sectionId: 'dashboardSection',
        sectionTitle: 'Command Centre',
        actionLabel: 'Stay on Command Centre',
        badges: ['steady state'],
        metrics: [{ label: 'Active projects', value: dashboard.activeProjects || 0 }, { label: 'Pending duties', value: dashboard.pendingDuties || 0 }]
      });
    }
    byId('dashboardFocusActions').innerHTML = `<div class="dashboard-action-grid">${actions.slice(0, 4).map(buildDashboardActionCard).join('')}</div>`;
    bindEntityActions(byId('dashboardFocusActions'));
  }

  function renderDashboardReviewQueue() {
    const dashboard = state.bootstrap.dashboard || {};
    const documents = getBootstrapArray('documents');
    const reports = getBootstrapArray('reports');
    const recentTimelineEntries = state.bootstrap.dashboard.recentTimelineEntries || [];
    const reviewCards = [
      {
        tone: 'neutral',
        eyebrow: 'Management review',
        title: 'Recent reporting and evidence check',
        description: 'Review the latest reports together with supporting evidence so the published organisational story remains backed by documents, maps, photos, and activity records.',
        sectionId: 'reportsSection',
        sectionTitle: 'Reports',
        actionLabel: 'Open reports',
        badges: ['leadership'],
        metrics: [{ label: 'Reports saved', value: reports.length }, { label: 'Recent timeline notes', value: recentTimelineEntries.length }]
      },
      {
        tone: 'accent',
        eyebrow: 'Evidence review',
        title: 'Spot records without deep supporting context',
        description: 'Use documents, photos, and maps together so every important project story can be defended during audits, donor review, or field verification.',
        sectionId: 'documentsSection',
        sectionTitle: 'Documents',
        actionLabel: 'Open documents',
        badges: ['quality review'],
        metrics: [{ label: 'Documents', value: dashboard.totalDocuments || 0 }, { label: 'Photos', value: dashboard.totalPhotos || 0 }, { label: 'Maps', value: (getBootstrapArray('maps') || []).length }]
      },
      {
        tone: 'neutral',
        eyebrow: 'Coordination review',
        title: 'Review project, beneficiary, and location reciprocity',
        description: 'When new records are added, confirm the related people, places, items, duties, and timeline notes are all represented so the story stays coordinated.',
        sectionId: 'entitySection',
        sectionTitle: 'Entity Explorer',
        actionLabel: 'Open Entity Explorer',
        badges: ['coordination'],
        metrics: [{ label: 'Projects', value: dashboard.totalProjects || 0 }, { label: 'Beneficiaries', value: dashboard.totalBeneficiaries || 0 }, { label: 'Locations', value: dashboard.totalLocations || 0 }]
      }
    ];
    byId('dashboardReviewQueue').innerHTML = `<div class="dashboard-action-grid compact">${reviewCards.map(buildDashboardActionCard).join('')}</div>`;
    bindEntityActions(byId('dashboardReviewQueue'));
  }

  function renderDashboardCharts() {
    const dashboard = state.bootstrap.dashboard || {};
    const timelineSeries = getTimelineMonthSeries(getBootstrapArray('timelineEntries'), 6);
    const activeProjects = Number(dashboard.activeProjects || 0);
    const completedProjects = Number(dashboard.completedProjects || 0);
    const followUpProjects = Number(dashboard.followUpRequired || 0);
    const totalProjects = Math.max(activeProjects + completedProjects + followUpProjects, Number(dashboard.totalProjects || 0));
    const pendingDuties = Number(dashboard.pendingDuties || 0);
    const completedDuties = Math.max(0, Number(dashboard.totalDuties || 0) - pendingDuties);
    const evidenceRows = [
      { label: 'Documents', value: dashboard.totalDocuments || 0 },
      { label: 'Photos', value: dashboard.totalPhotos || 0 },
      { label: 'Maps', value: (getBootstrapArray('maps') || []).length },
      { label: 'Excel imports', value: dashboard.totalExcelImports || 0 },
      { label: 'Reports', value: (getBootstrapArray('reports') || []).length }
    ];
    const chartCards = [
      {
        eyebrow: 'Portfolio balance',
        title: 'Project status health',
        description: 'A quick operational balance of active, completed, and follow-up work across the whole organisation.',
        bodyHtml: buildGraphBarRows([
          { label: 'Active', value: activeProjects },
          { label: 'Completed', value: completedProjects },
          { label: 'Follow-up', value: followUpProjects },
          { label: 'Total', value: totalProjects }
        ]),
        sectionId: 'projectsSection',
        sectionTitle: 'Projects',
        actionLabel: 'Open projects',
        badges: ['portfolio']
      },
      {
        eyebrow: 'Operational throughput',
        title: 'Duty completion balance',
        description: 'Shows whether assignment follow-through is keeping pace with operational workload.',
        bodyHtml: buildGraphBarRows([
          { label: 'Completed or cleared', value: completedDuties },
          { label: 'Pending', value: pendingDuties },
          { label: 'Total duties', value: dashboard.totalDuties || 0 }
        ]),
        sectionId: 'dutiesSection',
        sectionTitle: 'Duties',
        actionLabel: 'Open duties',
        badges: ['operations']
      },
      {
        eyebrow: 'Growth signal',
        title: 'Recent records entering the system',
        description: 'A six-month view of timeline activity showing whether organisational history is growing consistently.',
        sparkline: buildSparkline(timelineSeries.map((item) => item.value)),
        bodyHtml: buildGraphBarRows(timelineSeries.map((item) => ({ label: item.label, value: item.value }))),
        sectionId: 'timelineSection',
        sectionTitle: 'Timeline',
        actionLabel: 'Open timeline',
        badges: ['growth']
      },
      {
        eyebrow: 'Evidence mix',
        title: 'Documentation coverage',
        description: 'Shows how balanced the organisation record is across documents, photos, maps, imports, and reports.',
        bodyHtml: buildGraphBarRows(evidenceRows),
        sectionId: 'documentsSection',
        sectionTitle: 'Documents',
        actionLabel: 'Open evidence sections',
        badges: ['evidence']
      }
    ];
    byId('dashboardCharts').innerHTML = `<div class="dashboard-chart-grid">${chartCards.map(buildDashboardChartCard).join('')}</div>`;
    bindEntityActions(byId('dashboardCharts'));
  }

  function renderDashboard() {
    renderSummaryCards();
    renderMetricList(byId('impactSummary'), Object.entries(state.bootstrap.dashboard.impactSummary || {}).map(([key, value]) => ({
      label: humanise(key),
      value
    })));
    renderMetricList(byId('categorySummary'), (state.bootstrap.dashboard.categories || []).map((item) => ({
      label: item.categoryName,
      value: item.projectCount
    })));
    renderTimelineItems(byId('recentTimeline'), state.bootstrap.dashboard.recentTimelineEntries || []);

    byId('recentRecords').innerHTML = `
      <div class="stack-list">
        ${(state.bootstrap.dashboard.recentProjects || []).slice(0, 3).map((item) => `<div class="stack-item"><span>Project</span><button type="button" class="entity-deep-link" data-entity-type="project" data-entity-id="${item.id}">${escapeHtml(item.title)}</button></div>`).join('')}
        ${(state.bootstrap.dashboard.recentBeneficiaries || []).slice(0, 3).map((item) => `<div class="stack-item"><span>Beneficiary</span><button type="button" class="entity-deep-link" data-entity-type="beneficiary" data-entity-id="${item.id}">${escapeHtml(item.name)}</button></div>`).join('')}
        ${(state.bootstrap.dashboard.recentDocuments || []).slice(0, 3).map((item) => `<div class="stack-item"><span>Document</span><button type="button" class="entity-deep-link" data-entity-type="document" data-entity-id="${item.id}">${escapeHtml(item.originalFilename)}</button></div>`).join('')}
      </div>
    `;

    const impact = state.bootstrap.dashboard.impactSummary || {};
    byId('dashboardStory').innerHTML = `
      <div class="story-card">
        <h3>Connected record cycle</h3>
        <p>This workspace follows the thread from location to beneficiary to project to activity, evidence, extraction, reporting, and follow-up. Open any linked page to move forward or backward through the full operational history without duplicating records.</p>
        <p>Current tracked impact includes <strong>${escapeHtml(impact.treesPlanted || 0)}</strong> trees planted, <strong>${escapeHtml(impact.seedlingsIssued || 0)}</strong> seedlings issued, <strong>${escapeHtml(impact.trainingSessions || 0)}</strong> training sessions, and <strong>${escapeHtml(impact.beneficiariesReached || 0)}</strong> beneficiaries reached.</p>
      </div>
    `;
    renderDashboardFocusActions();
    renderDashboardReviewQueue();
    renderDashboardCharts();
    bindEntityActions(byId('recentRecords'));
  }

  function buildExplorerSectionTile(sectionId, title, description) {
    return `
      <div class="entity-link-tile">
        <div class="entity-tile-title">
          <strong>${escapeHtml(title)}</strong>
        </div>
        <div class="entity-tile-body">
          <div class="entity-tile-detail">${escapeHtml(description)}</div>
        </div>
        <div class="entity-tile-footer">
          <button type="button" class="inline-button entity-link-action" data-open-section="${escapeHtml(sectionId)}" data-section-title="${escapeHtml(title)}">Open section</button>
        </div>
      </div>
    `;
  }

  function buildEntityExplorerWelcome() {
    const dashboard = state.bootstrap?.dashboard || {};
    const coreTiles = [
      ...(dashboard.recentProjects || []).slice(0, 2).map(projectTile),
      ...(dashboard.recentBeneficiaries || []).slice(0, 2).map(beneficiaryTile),
      ...(dashboard.recentDocuments || []).slice(0, 2).map(documentTile)
    ].filter(Boolean);

    const startTiles = [
      buildExplorerSectionTile('projectsSection', 'Projects', 'See the organisation portfolio, categories, status, geography, and linked operational records.'),
      buildExplorerSectionTile('beneficiariesSection', 'Beneficiaries', 'Understand who was reached, what they received, and how they connect to project history.'),
      buildExplorerSectionTile('locationsSection', 'Locations', 'Read the geographical story from administrative hierarchy down to operating sites.'),
      buildExplorerSectionTile('projectItemsSection', 'Project Items', 'Follow distributed items, outcomes, sub-items, and survival or replacement history.')
    ];

    const intelligenceTiles = [
      buildExplorerSectionTile('documentsSection', 'Documents', 'Trace uploaded evidence into extracted entries, linked records, and source documents.'),
      buildExplorerSectionTile('photosSection', getBranding().mediaSectionLabel || 'Photo Evidence', 'Open visual evidence and move across linked projects, beneficiaries, locations, and activities.'),
      buildExplorerSectionTile('calendarSection', 'Calendar', 'Read the historical operational rhythm by day, month, activity, duty, and item movement.'),
      buildExplorerSectionTile('reportsSection', 'Reports', 'See how the linked records are summarised into export and reporting surfaces.')
    ];

    return `
      <div class="entity-dossier entity-page-shell">
        <div class="dossier-header">
          <div>
            <p class="eyebrow">Entity Explorer</p>
            <h3>Organisation intelligence overview</h3>
            <p>Use this explorer to move from the big organisational picture down into sections, records, evidence, extracted rows, and historical events without losing context.</p>
          </div>
          <div class="meta-badges">
            ${badgeHtml(`projects ${dashboard.totalProjects || 0}`, 'muted')}
            ${badgeHtml(`beneficiaries ${dashboard.totalBeneficiaries || 0}`, 'muted')}
            ${badgeHtml(`documents ${dashboard.totalDocuments || 0}`, 'muted')}
            ${badgeHtml(`timeline ${dashboard.recentTimelineEntries?.length || 0}`, 'muted')}
          </div>
        </div>
        ${renderStoryCallout('Start at any register, then open a full page to follow the connected story through people, places, items, evidence, extracted rows, reports, and timeline history. This is the main narrative navigation layer for the organisation workspace.')}
        <div>
          ${renderDetailCards([
            { label: 'Projects tracked', value: dashboard.totalProjects || 0 },
            { label: 'Beneficiaries tracked', value: dashboard.totalBeneficiaries || 0 },
            { label: 'Locations tracked', value: dashboard.totalLocations || 0 },
            { label: 'Documents tracked', value: dashboard.totalDocuments || 0 },
            { label: 'Photo evidence tracked', value: dashboard.totalPhotos || 0 },
            { label: 'Extracted rows tracked', value: dashboard.totalEntries || 0 }
          ])}
        </div>
        <div class="linked-grid">
          ${renderEntityGroup('Start with the core organisational registers', startTiles, 'Core registers are not available yet.', 'story-grid')}
          ${renderEntityGroup('Open the main intelligence surfaces', intelligenceTiles, 'Intelligence surfaces are not available yet.', 'story-grid')}
          ${renderEntityGroup('Recent connected story pages', coreTiles, 'No recent story pages yet.', 'story-grid')}
        </div>
      </div>
    `;
  }

  function getTableKey(target) {
    return target.id || target.dataset.tableKey || 'table';
  }

  function setTablePage(tableKey, page) {
    state.tablePaging[tableKey] = Math.max(1, Number(page || 1));
  }

  function renderPaginationControls(tableKey, currentPage, totalPages, totalRows, pageSize) {
    if (totalPages <= 1) {
      return '';
    }
    const start = ((currentPage - 1) * pageSize) + 1;
    const end = Math.min(totalRows, currentPage * pageSize);
    return `
      <div class="pagination-bar">
        <span class="pagination-summary">Showing ${escapeHtml(start)}-${escapeHtml(end)} of ${escapeHtml(totalRows)}</span>
        <div class="pagination-actions">
          <button type="button" class="inline-button pagination-button" data-page-target="${escapeHtml(tableKey)}" data-page-direction="prev" ${currentPage <= 1 ? 'disabled' : ''}>Previous</button>
          <span class="pagination-status">Page ${escapeHtml(currentPage)} of ${escapeHtml(totalPages)}</span>
          <button type="button" class="inline-button pagination-button" data-page-target="${escapeHtml(tableKey)}" data-page-direction="next" ${currentPage >= totalPages ? 'disabled' : ''}>Next</button>
        </div>
      </div>
    `;
  }

  function bindPaginationButtons(target, tableKey, currentPage) {
    target.querySelectorAll('.pagination-button').forEach((button) => {
      button.addEventListener('click', () => {
        const direction = button.dataset.pageDirection;
        setTablePage(tableKey, direction === 'next' ? currentPage + 1 : currentPage - 1);
        const rerender = state.tableRenderers[tableKey];
        if (rerender) {
          rerender();
        }
      });
    });
  }

  function renderTable(target, columns, rows, actions, emptyText) {
    if (!target) {
      return;
    }
    if (!rows.length) {
      setTablePage(getTableKey(target), 1);
      renderEmptyState(target, emptyText || 'No records found.');
      return;
    }

    const tableKey = getTableKey(target);
    state.tableRenderers[tableKey] = () => renderTable(target, columns, rows, actions, emptyText);
    const totalPages = Math.max(1, Math.ceil(rows.length / TABLE_PAGE_SIZE));
    const currentPage = Math.min(state.tablePaging[tableKey] || 1, totalPages);
    setTablePage(tableKey, currentPage);
    const startIndex = (currentPage - 1) * TABLE_PAGE_SIZE;
    const visibleRows = rows.slice(startIndex, startIndex + TABLE_PAGE_SIZE);

    target.innerHTML = `
      <div class="table-shell">
        <table>
          <thead>
            <tr>
              ${columns.map((column) => `<th>${escapeHtml(column.label)}</th>`).join('')}
              ${actions ? '<th>Actions</th>' : ''}
            </tr>
          </thead>
          <tbody>
            ${visibleRows.map((row) => `
              <tr>
                ${columns.map((column) => `<td>${column.render ? column.render(row) : escapeHtml(row[column.key] ?? '—')}</td>`).join('')}
                ${actions ? `<td><div class="action-row">${actions(row).join('')}</div></td>` : ''}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      ${renderPaginationControls(tableKey, currentPage, totalPages, rows.length, TABLE_PAGE_SIZE)}
    `;
    bindPaginationButtons(target, tableKey, currentPage);
  }

  function bindActionButtons(target, handlers) {
    Object.entries(handlers).forEach(([selector, handler]) => {
      target.querySelectorAll(selector).forEach((node) => {
        node.addEventListener('click', handler);
      });
    });
  }

  function encodeEntityId(type, id) {
    return ['geo', 'project_item_subitem'].includes(type) ? encodeURIComponent(JSON.stringify(id)) : String(id);
  }

  function decodeEntityId(type, value) {
    return ['geo', 'project_item_subitem'].includes(type) ? JSON.parse(decodeURIComponent(value)) : Number(value);
  }

  function entityMatchKey(type, id) {
    return `${type}:${['geo', 'project_item_subitem'].includes(type) ? JSON.stringify(id) : String(id)}`;
  }

  function entityPreviewImage(item) {
    if (!item || !item.storagePath) {
      return '';
    }
    return `file:///${escapeHtml(String(item.storagePath).replace(/\\/g, '/'))}`;
  }

  function getEntityCardActionConfig(type, id) {
    const numericId = Number(id);
    switch (type) {
      case 'project':
        return { edit: true, remove: true, openType: 'project', openId: numericId };
      case 'project_category':
        return { edit: true, remove: true, openType: 'project_category', openId: numericId };
      case 'beneficiary':
        return { edit: true, remove: true, openType: 'beneficiary', openId: numericId };
      case 'location':
        return { edit: true, remove: true, openType: 'location', openId: numericId };
      case 'activity':
        return { edit: true, remove: true, openType: 'activity', openId: numericId };
      case 'duty':
        return { edit: true, remove: true, openType: 'duty', openId: numericId };
      case 'project_item':
        return { edit: true, remove: true, openType: 'project_item', openId: numericId };
      case 'document':
        return { edit: false, remove: true, openType: 'document', openId: numericId };
      case 'photo':
        return { edit: true, remove: true, openType: 'photo', openId: numericId };
      case 'map':
        return { edit: true, remove: true, openType: 'map', openId: numericId };
      case 'excel_import':
        return { edit: false, remove: true, openType: 'excel_import', openId: numericId };
      case 'extracted_entry':
        return { edit: false, remove: true, openType: 'extracted_entry', openId: numericId };
      default:
        return { edit: false, remove: false, openType: type, openId: id };
    }
  }

  function buildEntityTileDetailRows(config) {
    const detailRows = Array.isArray(config.details) && config.details.length
      ? config.details.filter((value) => String(value || '').trim() !== '')
      : [config.subtitle, config.description].filter((value) => String(value || '').trim() !== '');

    const detailsHtml = detailRows.slice(0, 3).map((detail) => `<div class="entity-tile-detail">${escapeHtml(detail)}</div>`).join('');
    const badges = Array.isArray(config.badges) ? config.badges.filter(Boolean).slice(0, 3) : [];
    const badgesHtml = badges.length
      ? `<div class="entity-tile-badges">${badges.map((badge) => badgeHtml(badge)).join('')}</div>`
      : '';

    return `
      <div class="entity-tile-body">
        ${detailsHtml || '<div class="entity-tile-detail">Open the full page to see the complete record.</div>'}
        ${badgesHtml}
      </div>
    `;
  }

  function buildEntityTileFooter(type, id, openLabel = 'Open full page') {
    const actionConfig = getEntityCardActionConfig(type, id);
    const openType = actionConfig.openType || type;
    const openId = actionConfig.openId !== undefined ? actionConfig.openId : id;
    return `
      <div class="entity-tile-footer">
        <button type="button" class="inline-button entity-link-action" data-entity-type="${escapeHtml(openType)}" data-entity-id="${escapeHtml(encodeEntityId(openType, openId))}">${escapeHtml(openLabel)}</button>
        ${actionConfig.edit ? `<button type="button" class="inline-button entity-card-edit" data-entity-edit-type="${escapeHtml(type)}" data-entity-edit-id="${escapeHtml(id)}">Edit</button>` : ''}
        ${actionConfig.remove ? `<button type="button" class="inline-button entity-card-remove" data-entity-remove-type="${escapeHtml(type)}" data-entity-remove-id="${escapeHtml(id)}">Remove</button>` : ''}
      </div>
    `;
  }

  function entityTileHtml(config) {
    if (!config || !config.id || !config.type) {
      return '';
    }
    const title = escapeHtml(config.title || 'Open record');
    const media = config.mediaHtml
      ? config.mediaHtml
      : (config.image
      ? `<div class="entity-media-preview entity-tile-image"><img src="${config.image}" alt="${title}"></div>`
      : '');
    return `
      <div class="entity-link-tile">
        ${media}
        <div class="entity-tile-title">
          <strong>${title}</strong>
        </div>
        ${buildEntityTileDetailRows(config)}
        ${buildEntityTileFooter(config.type, config.id, config.openLabel || 'Open full page')}
      </div>
    `;
  }

  function renderEntityGroup(title, items, emptyText, cssClass) {
    return `
      <details class="linked-card linked-card-collapsible">
        <summary class="linked-card-summary">
          <h4>${escapeHtml(title)}</h4>
        </summary>
        <div class="linked-card-content">
          <div class="entity-tile-grid ${escapeHtml(cssClass || 'compact-grid')}">
            ${items.length ? items.join('') : `<div class="empty-inline">${escapeHtml(emptyText || 'No linked records yet.')}</div>`}
          </div>
        </div>
      </details>
    `;
  }

  function renderStoryCallout(text) {
    return `<div class="entity-summary-callout">${escapeHtml(text)}</div>`;
  }

  function calendarDistributionTile(event) {
    if (!event || !event.itemId) {
      return '';
    }
    return `
      <div class="entity-link-tile">
        <div class="entity-tile-header">
          <div class="entity-tile-copy">
            <strong>${escapeHtml(event.title || 'Distributed item')}</strong>
            <small>${escapeHtml(`${event.quantityDistributed || 0} ${event.unitLabel || 'items'}`)}</small>
          </div>
          <div class="entity-tile-actions">
            <button type="button" class="inline-button entity-deep-link entity-link-action" data-entity-type="project_item" data-entity-id="${escapeHtml(event.itemId)}">Open full page</button>
            <button type="button" class="inline-button calendar-edit-item entity-link-action" data-item-id="${escapeHtml(event.itemId)}">Edit item</button>
          </div>
        </div>
        <p>${escapeHtml(buildCalendarNarrative(event))}</p>
        <div class="entity-tile-meta">
          ${badgeHtml(event.projectTitle || 'Project')}
          ${event.beneficiaryName ? badgeHtml(event.beneficiaryName, 'muted') : ''}
          ${event.locationName ? badgeHtml(event.locationName, 'warning') : ''}
        </div>
      </div>
    `;
  }

  function calendarEventTile(event) {
    if (!event) {
      return '';
    }
    const actionButtons = [
      event.dutyId ? `<button type="button" class="inline-button entity-deep-link entity-link-action" data-entity-type="duty" data-entity-id="${escapeHtml(event.dutyId)}">Duty page</button>` : '',
      event.activityId ? `<button type="button" class="inline-button entity-deep-link entity-link-action" data-entity-type="activity" data-entity-id="${escapeHtml(event.activityId)}">Activity page</button>` : '',
      event.timelineId ? `<button type="button" class="inline-button entity-deep-link entity-link-action" data-entity-type="timeline" data-entity-id="${escapeHtml(event.timelineId)}">Timeline page</button>` : '',
      event.dateKey ? `<button type="button" class="inline-button duty-open-calendar-day entity-link-action" data-calendar-day="${escapeHtml(event.dateKey)}">Open day</button>` : ''
    ].filter(Boolean).join('');
    return `
      <div class="entity-link-tile">
        <div class="entity-tile-header">
          <div class="entity-tile-copy">
            <strong>${escapeHtml(event.title || getCalendarEventTypeLabel(event.eventType))}</strong>
            <small>${escapeHtml(formatDate(event.dateKey))} | ${escapeHtml(getCalendarEventTypeLabel(event.eventType))}</small>
          </div>
          ${actionButtons ? `<div class="entity-tile-actions">${actionButtons}</div>` : ''}
        </div>
        <p>${escapeHtml(buildCalendarNarrative(event))}</p>
        <div class="entity-tile-meta">
          ${event.projectTitle ? badgeHtml(event.projectTitle) : ''}
          ${event.beneficiaryName ? badgeHtml(event.beneficiaryName, 'muted') : ''}
          ${event.locationName ? badgeHtml(event.locationName, 'warning') : ''}
        </div>
      </div>
    `;
  }

  function uniqueEntities(items) {
    const seen = new Set();
    return (items || []).filter((item) => {
      if (!item || !item.id) {
        return false;
      }
      const key = String(item.id);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  function relatedPhotoQuickLinks(photo) {
    if (!photo) {
      return [];
    }
    return [
      photo.documentId ? { type: 'document', id: photo.documentId, label: 'Source document' } : null,
      photo.projectId ? { type: 'project', id: photo.projectId, label: 'Project' } : null,
      photo.beneficiaryId ? { type: 'beneficiary', id: photo.beneficiaryId, label: 'Beneficiary' } : null,
      photo.locationId ? { type: 'location', id: photo.locationId, label: 'Location' } : null,
      photo.activityId ? { type: 'activity', id: photo.activityId, label: 'Activity' } : null
    ].filter(Boolean);
  }

  function renderPhotoLinkedSummary(photo) {
    const items = [
      photo?.projectTitle ? { label: 'Project', value: photo.projectTitle } : null,
      photo?.beneficiaryName ? { label: 'Beneficiary', value: photo.beneficiaryName } : null,
      photo?.locationName ? { label: 'Location', value: photo.locationName } : null,
      photo?.activityTitle ? { label: 'Activity', value: photo.activityTitle } : null,
      photo?.originalFilename ? { label: 'Source document', value: photo.originalFilename } : null
    ].filter(Boolean);

    if (!items.length) {
      return '';
    }

    return `
      <div class="entity-photo-linked-summary">
        ${items.map((item) => `
          <div class="entity-photo-linked-item">
            <span>${escapeHtml(item.label)}</span>
            <strong>${escapeHtml(item.value)}</strong>
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderPhotoDirectLinks(bundle) {
    const items = [
      bundle?.document ? documentTile(bundle.document) : '',
      bundle?.project ? projectTile(bundle.project) : '',
      bundle?.beneficiary ? beneficiaryTile(bundle.beneficiary) : '',
      bundle?.location ? locationTile(bundle.location) : '',
      bundle?.activity ? activityTile(bundle.activity) : ''
    ].filter(Boolean);

    if (!items.length) {
      return '';
    }

    return `
      <div class="linked-card">
        <h4>Directly linked records</h4>
        <div class="entity-tile-grid story-grid">
          ${items.join('')}
        </div>
      </div>
    `;
  }

  function photoRelationsMatch(basePhoto, candidate) {
    if (!basePhoto || !candidate || basePhoto.id === candidate.id) {
      return false;
    }

    if (basePhoto.documentId && candidate.documentId && basePhoto.documentId === candidate.documentId) {
      return true;
    }

    const relationKeys = ['projectId', 'beneficiaryId', 'locationId', 'activityId'];
    const sharedKeys = relationKeys.filter((key) => basePhoto[key] && candidate[key]);
    if (!sharedKeys.length) {
      return false;
    }

    return sharedKeys.every((key) => basePhoto[key] === candidate[key]);
  }

  function photoLinkedItemMatch(photo, item) {
    if (!photo || !item) {
      return false;
    }

    if (photo.documentId && item.documentId && item.documentId === photo.documentId) {
      return true;
    }

    const relationPairs = [
      ['projectId', 'projectId'],
      ['beneficiaryId', 'beneficiaryId'],
      ['locationId', 'locationId'],
      ['activityId', 'activityId']
    ];
    const sharedPairs = relationPairs.filter(([photoKey, itemKey]) => photo[photoKey] && item[itemKey]);
    if (!sharedPairs.length) {
      return false;
    }

    return sharedPairs.every(([photoKey, itemKey]) => photo[photoKey] === item[itemKey]);
  }

  function renderEntityHero(photo, documentRecord, emptyLabel, options = {}) {
    return `
      <div class="entity-media-hero-shell${options.contained ? ' entity-media-hero-shell-contained' : ''}">
        ${photo
          ? `<div class="entity-hero-image entity-hero-image-wide${options.contained ? ' entity-hero-image-contained' : ''}"><img src="${entityPreviewImage(photo)}" alt="${escapeHtml(photo.title)}"></div>`
          : `<div class="empty-state">${escapeHtml(emptyLabel || 'No featured image yet.')}</div>`}
        ${documentRecord ? renderEntityGroup('Featured reference file', [documentTile(documentRecord)], 'No featured reference file.', 'story-grid') : ''}
      </div>
    `;
  }

  function slugifySectionLabel(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'section';
  }

  function getEntityTocIcon(label) {
    const value = String(label || '').toLowerCase();
    if (value.includes('overview')) return '🏠';
    if (value.includes('location')) return '📍';
    if (value.includes('beneficiar')) return '👥';
    if (value.includes('project')) return '🌱';
    if (value.includes('activit')) return '🛠️';
    if (value.includes('document')) return '📄';
    if (value.includes('photo')) return '🖼️';
    if (value.includes('extract')) return '📊';
    if (value.includes('report')) return '📑';
    if (value.includes('timeline') || value.includes('history')) return '🕒';
    if (value.includes('administrative') || value.includes('trail')) return '🧭';
    if (value.includes('sheet')) return '📋';
    if (value.includes('metric')) return '📈';
    return '•';
  }

  function enhanceEntityExplorerToc(target) {
    if (!target) {
      return;
    }
    const dossier = target.querySelector('.entity-page-shell');
    if (!dossier) {
      return;
    }

    const tocItems = [];
    const header = dossier.querySelector('.dossier-header');
    if (header) {
      header.id = header.id || 'entity-overview';
      tocItems.push({ id: header.id, label: 'Overview' });
    }

    dossier.querySelectorAll('.linked-card > h4, .linked-card > summary > h4').forEach((heading, index) => {
      const section = heading.closest('.linked-card');
      if (!section) {
        return;
      }
      const sectionId = section.id || `entity-section-${slugifySectionLabel(heading.textContent)}-${index + 1}`;
      section.id = sectionId;
      tocItems.push({ id: sectionId, label: heading.textContent.trim() });
    });

    if (tocItems.length < 2) {
      return;
    }

    const originalHtml = dossier.outerHTML;
    target.innerHTML = `
      <div class="entity-explorer-layout">
        <div class="entity-explorer-main">${originalHtml}</div>
        <aside class="entity-explorer-toc">
          <div class="entity-toc-card">
            <div class="entity-toc-list">
              ${tocItems.map((item) => `
                <a href="#${escapeHtml(item.id)}" class="entity-toc-link" title="${escapeHtml(item.label)}" aria-label="${escapeHtml(item.label)}">
                  <span class="entity-toc-icon" aria-hidden="true">${getEntityTocIcon(item.label)}</span>
                </a>
              `).join('')}
            </div>
          </div>
        </aside>
      </div>
    `;

    target.querySelectorAll('.entity-toc-link').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const targetId = link.getAttribute('href')?.slice(1);
        const anchor = targetId ? target.querySelector(`#${targetId}`) : null;
        anchor?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function buildLocationTrail(parts) {
    const trail = [];
    if (parts.county) {
      trail.push(entityTileHtml({
        type: 'geo',
        id: { level: 'county', name: parts.county, county: parts.county },
        title: parts.county,
        subtitle: 'County page',
        badges: ['county']
      }));
    }
    if (parts.subCounty) {
      trail.push(entityTileHtml({
        type: 'geo',
        id: { level: 'sub_county', name: parts.subCounty, county: parts.county || '', subCounty: parts.subCounty },
        title: parts.subCounty,
        subtitle: 'Sub-county page',
        badges: ['sub_county']
      }));
    }
    if (parts.ward) {
      trail.push(entityTileHtml({
        type: 'geo',
        id: { level: 'ward', name: parts.ward, county: parts.county || '', subCounty: parts.subCounty || '', ward: parts.ward },
        title: parts.ward,
        subtitle: 'Ward page',
        badges: ['ward']
      }));
    }
    if (parts.village) {
      trail.push(entityTileHtml({
        type: 'geo',
        id: { level: 'village', name: parts.village, county: parts.county || '', subCounty: parts.subCounty || '', ward: parts.ward || '', village: parts.village },
        title: parts.village,
        subtitle: 'Village page',
        badges: ['village']
      }));
    }
    return trail;
  }

  function normaliseText(value) {
    return String(value || '').trim().toLowerCase();
  }

  function matchesGeoPath(item, geo) {
    const countyMatch = !geo.county || normaliseText(item.county) === normaliseText(geo.county);
    const subCountyMatch = !geo.subCounty || normaliseText(item.subCounty) === normaliseText(geo.subCounty);
    const wardMatch = !geo.ward || normaliseText(item.ward) === normaliseText(geo.ward);
    const villageMatch = !geo.village || normaliseText(item.village) === normaliseText(geo.village);
    if (geo.level === 'county') {
      return countyMatch;
    }
    if (geo.level === 'sub_county') {
      return countyMatch && subCountyMatch;
    }
    if (geo.level === 'ward') {
      return countyMatch && subCountyMatch && wardMatch;
    }
    return countyMatch && subCountyMatch && wardMatch && villageMatch;
  }

  function uniqueGeoChildren(items, key, parentGeo) {
    const seen = new Set();
    return items
      .filter((item) => matchesGeoPath(item, parentGeo) && item[key])
      .filter((item) => {
        const value = normaliseText(item[key]);
        if (!value || seen.has(value)) {
          return false;
        }
        seen.add(value);
        return true;
      })
      .map((item) => item[key]);
  }

  function getGeoBundle(geo) {
    const projects = getBootstrapArray('projects').filter((item) => matchesGeoPath(item, geo));
    const beneficiaries = getBootstrapArray('beneficiaries').filter((item) => matchesGeoPath(item, geo));
    const locations = getBootstrapArray('locations').filter((item) => matchesGeoPath(item, geo));
    const activities = getBootstrapArray('activities').filter((item) => {
      const location = item.locationId ? getLocationById(item.locationId) : null;
      const record = location || item;
      return matchesGeoPath(record, geo);
    });
    const documents = getBootstrapArray('documents').filter((item) => {
      const location = item.locationId ? getLocationById(item.locationId) : null;
      const project = item.relatedProjectId ? getProjectById(item.relatedProjectId) : null;
      return matchesGeoPath(location || project || item, geo);
    });
    const photos = getBootstrapArray('photos').filter((item) => {
      const location = item.locationId ? getLocationById(item.locationId) : null;
      const project = item.projectId ? getProjectById(item.projectId) : null;
      return matchesGeoPath(location || project || item, geo);
    });
    const entries = getBootstrapArray('extractedEntries').filter((item) => {
      const location = item.locationId ? getLocationById(item.locationId) : null;
      const project = item.projectId ? getProjectById(item.projectId) : null;
      return matchesGeoPath(location || project || item, geo);
    });
    const timeline = getBootstrapArray('timelineEntries').filter((item) => {
      const location = item.locationId ? getLocationById(item.locationId) : null;
      const project = item.projectId ? getProjectById(item.projectId) : null;
      return matchesGeoPath(location || project || item, geo);
    });
    const reports = getBootstrapArray('reports').filter((item) => {
      const location = item.locationId ? getLocationById(item.locationId) : null;
      const project = item.projectId ? getProjectById(item.projectId) : null;
      return matchesGeoPath(location || project || item, geo);
    });

    const allGeoSources = [...projects, ...beneficiaries, ...locations];
    const children = geo.level === 'county'
      ? uniqueGeoChildren(allGeoSources, 'subCounty', geo).map((name) => ({ level: 'sub_county', name }))
      : geo.level === 'sub_county'
        ? uniqueGeoChildren(allGeoSources, 'ward', geo).map((name) => ({ level: 'ward', name }))
        : geo.level === 'ward'
          ? uniqueGeoChildren(allGeoSources, 'village', geo).map((name) => ({ level: 'village', name }))
          : [];
    return {
      geo,
      projects,
      beneficiaries,
      locations,
      activities,
      documents,
      photos,
      entries,
      timeline,
      reports,
      children
    };
  }

  function bindEntityActions(target) {
    if (!target) {
      return;
    }
    target.querySelectorAll('[data-entity-type]').forEach((button) => {
      button.addEventListener('click', () => {
        const sliderContext = buildEntitySliderContext(button);
        const entityType = button.dataset.entityType;
        const entityId = decodeEntityId(entityType, button.dataset.entityId);
        openEntity(
          entityType,
          entityId,
          sliderContext ? { sliderContext } : {}
        );
        if (entityType === 'project_item' || entityType === 'project_item_subitem') {
          switchSection('entitySection', 'Entity Explorer');
        }
      });
    });
    target.querySelectorAll('[data-slider-direction]').forEach((button) => {
      button.addEventListener('click', () => {
        if (!state.entitySlider || !Array.isArray(state.entitySlider.items) || !state.entitySlider.items.length) {
          return;
        }
        const delta = button.dataset.sliderDirection === 'next' ? 1 : -1;
        const nextIndex = state.entitySlider.currentIndex + delta;
        const nextItem = state.entitySlider.items[nextIndex];
        if (!nextItem) {
          return;
        }
        openEntity(nextItem.type, nextItem.id, {
          sliderContext: {
            ...state.entitySlider,
            currentIndex: nextIndex
          }
        });
      });
    });
    target.querySelectorAll('[data-open-section]').forEach((button) => {
      button.addEventListener('click', () => switchSection(button.dataset.openSection, button.dataset.sectionTitle || button.textContent));
    });
    target.querySelectorAll('[data-open-file-id]').forEach((button) => {
      button.addEventListener('click', async () => {
        await performAction(() => window.environmentApp.openStoredFile(Number(button.dataset.openFileId)), 'Stored file opened.');
      });
    });
    target.querySelectorAll('[data-open-map-id]').forEach((button) => {
      button.addEventListener('click', () => {
        openMapRecord(Number(button.dataset.openMapId));
      });
    });
    target.querySelectorAll('[data-entity-edit-type][data-entity-edit-id]').forEach((button) => {
      button.addEventListener('click', () => {
        const type = button.dataset.entityEditType;
        const id = decodeEntityId(type, button.dataset.entityEditId);
        if (type === 'project') {
          fillProjectForm(Number(id));
          switchSection('projectsSection', 'Projects');
        } else if (type === 'project_category') {
          populateCategoryForm(getCategoryById(Number(id)));
          switchSection('categoriesSection', 'Project Categories');
        } else if (type === 'beneficiary') {
          fillBeneficiaryForm(Number(id));
          switchSection('beneficiariesSection', 'Beneficiaries');
        } else if (type === 'location') {
          fillLocationForm(Number(id));
          switchSection('locationsSection', 'Locations');
        } else if (type === 'activity') {
          populateActivityForm(getActivityById(Number(id)));
          switchSection('activitiesSection', 'Activities');
        } else if (type === 'duty') {
          populateDutyForm(getDutyById(Number(id)));
          switchSection('dutiesSection', 'Duties');
        } else if (type === 'project_item') {
          populateProjectItemForm(getProjectItemById(Number(id)));
          switchSection('projectItemsSection', 'Project Items');
        } else if (type === 'photo') {
          populatePhotoForm(getPhotoById(Number(id)), 'edit');
          switchSection('photosSection', getBranding().mediaSectionLabel || 'Photo Evidence');
        } else if (type === 'map') {
          populateMapForm(getMapById(Number(id)));
          switchSection('mapsSection', 'Maps');
        }
      });
    });
    target.querySelectorAll('[data-entity-remove-type][data-entity-remove-id]').forEach((button) => {
      button.addEventListener('click', async () => {
        const type = button.dataset.entityRemoveType;
        const id = decodeEntityId(type, button.dataset.entityRemoveId);
        try {
          if (type === 'project') {
            const project = getProjectById(Number(id));
            if (!project || !window.confirm(`Delete project "${project.title}"?`)) return;
            await performAction(() => window.environmentApp.deleteProject(Number(id)), 'Project deleted.');
          } else if (type === 'project_category') {
            const category = getCategoryById(Number(id));
            if (!category || !window.confirm(`Delete category "${category.name}"?`)) return;
            await performAction(() => window.environmentApp.deleteCategory(Number(id)), 'Category removed.');
          } else if (type === 'beneficiary') {
            const beneficiary = getBeneficiaryById(Number(id));
            if (!beneficiary || !window.confirm(`Delete beneficiary "${beneficiary.name}"?`)) return;
            await performAction(() => window.environmentApp.deleteBeneficiary(Number(id)), 'Beneficiary deleted.');
          } else if (type === 'location') {
            const location = getLocationById(Number(id));
            if (!location || !window.confirm(`Delete location "${location.name}"?`)) return;
            await performAction(() => window.environmentApp.deleteLocation(Number(id)), 'Location deleted.');
          } else if (type === 'activity') {
            const activity = getActivityById(Number(id));
            if (!activity || !window.confirm(`Delete activity "${activity.title}"?`)) return;
            await performAction(() => window.environmentApp.deleteActivity(Number(id)), 'Activity deleted.');
          } else if (type === 'duty') {
            const duty = getDutyById(Number(id));
            if (!duty || !window.confirm(`Delete duty "${duty.title}"?`)) return;
            await performAction(() => window.environmentApp.deleteDuty(Number(id)), 'Duty deleted.');
          } else if (type === 'project_item') {
            const item = getProjectItemById(Number(id));
            if (!item || !window.confirm(`Delete project item "${item.itemType || 'row'}" from "${item.projectTitle}"?`)) return;
            await performAction(() => deleteProjectItemRecord(Number(id)), 'Project item removed.');
          } else if (type === 'document') {
            const documentRecord = getDocumentById(Number(id));
            const label = documentRecord?.originalFilename || `document ${id}`;
            if (!documentRecord || !window.confirm(`Remove document "${label}" and its dependent imported records?`)) return;
            await performAction(() => window.environmentApp.deleteDocument(Number(id)), 'Document removed.');
          } else if (type === 'photo') {
            const photo = getPhotoById(Number(id));
            if (!photo || !window.confirm(`Remove "${photo.title}" and its linked stored image file?`)) return;
            await performAction(() => window.environmentApp.deletePhoto(Number(id)), 'Photo removed.');
          } else if (type === 'map') {
            const mapRecord = getMapById(Number(id));
            if (!mapRecord || !window.confirm(`Remove map "${mapRecord.title}"? The linked image evidence will stay available.`)) return;
            await performAction(() => window.environmentApp.deleteMap(Number(id)), 'Map record removed.');
          } else if (type === 'excel_import') {
            const excelImport = getExcelImportById(Number(id));
            const label = excelImport?.originalFilename || `import ${id}`;
            if (!excelImport?.documentId || !window.confirm(`Remove imported document "${label}" and its extracted rows?`)) return;
            await performAction(() => window.environmentApp.deleteDocument(Number(excelImport.documentId)), 'Imported document removed.');
          } else if (type === 'extracted_entry') {
            const entry = getEntryById(Number(id));
            if (!entry || !window.confirm(`Remove extracted row ${entry.sourceRowNumber || entry.id}?`)) return;
            await performAction(() => window.environmentApp.deleteExtractedEntry(Number(id)), 'Extracted row removed.');
          }
          renderEntityPage();
        } catch (error) {
          showNotification(error.message, true);
        }
      });
    });
    target.querySelectorAll('.calendar-edit-item').forEach((button) => {
      button.addEventListener('click', () => {
        const itemId = Number(button.dataset.itemId || 0);
        populateProjectItemForm(getProjectItemById(itemId));
        switchSection('projectItemsSection', 'Project Items');
      });
    });
    target.querySelectorAll('.duty-open-calendar-day').forEach((button) => {
      button.addEventListener('click', () => {
        state.selectedCalendarDay = button.dataset.calendarDay || '';
        setTablePage('calendarEventsTable', 1);
        renderCalendar(state.views.calendar || deriveCalendarEvents());
        if (state.selectedCalendarDay) {
          byId('calendarDayTitle').textContent = `Calendar Day: ${formatDate(state.selectedCalendarDay)}`;
          switchSection('calendarDaySection', `Calendar Day: ${formatDate(state.selectedCalendarDay)}`);
        }
      });
    });
    target.querySelectorAll('[data-workbook-sheet-key]').forEach((button) => {
      button.addEventListener('click', () => {
        state.selectedWorkbookSheetKey = button.dataset.workbookSheetKey || null;
        renderEntityPage();
      });
    });
  }

  function buildEntitySliderContext(button) {
    const detailPanel = byId('entityDetailPanel');
    if (!detailPanel || !detailPanel.contains(button)) {
      return null;
    }
    const section = button.closest('.linked-card, .entity-photo-gallery-panel');
    if (!section) {
      return null;
    }
    const items = Array.from(section.querySelectorAll('.entity-link-action[data-entity-type][data-entity-id]')).map((node) => ({
      type: node.dataset.entityType,
      id: decodeEntityId(node.dataset.entityType, node.dataset.entityId)
    }));
    if (items.length < 2) {
      return null;
    }
    const activeId = decodeEntityId(button.dataset.entityType, button.dataset.entityId);
    const currentIndex = items.findIndex((item) => entityMatchKey(item.type, item.id) === entityMatchKey(button.dataset.entityType, activeId));
    if (currentIndex < 0) {
      return null;
    }
    const sectionTitle = section.querySelector('h4') ? section.querySelector('h4').textContent.trim() : 'Linked records';
    return { sectionTitle, items, currentIndex };
  }

  function renderEntitySliderBar(type, id) {
    const slider = state.entitySlider;
    if (!slider || !Array.isArray(slider.items) || slider.items.length < 2) {
      return '';
    }
    const index = slider.items.findIndex((item) => entityMatchKey(item.type, item.id) === entityMatchKey(type, id));
    if (index < 0) {
      return '';
    }
    slider.currentIndex = index;
    const previousDisabled = index <= 0 ? 'disabled' : '';
    const nextDisabled = index >= slider.items.length - 1 ? 'disabled' : '';
    return `
      <div class="entity-slider-bar">
        <div class="entity-slider-copy">
          <strong>${escapeHtml(slider.sectionTitle || 'Linked records')}</strong>
          <span>${escapeHtml(index + 1)} of ${escapeHtml(slider.items.length)}</span>
        </div>
        <div class="entity-slider-actions">
          <button type="button" class="inline-button" data-slider-direction="prev" ${previousDisabled}>Previous</button>
          <button type="button" class="inline-button" data-slider-direction="next" ${nextDisabled}>Next</button>
        </div>
      </div>
    `;
  }

  function openEntity(type, id, options = {}) {
    const sourceTrail = Array.isArray(options.breadcrumbTrail) && options.breadcrumbTrail.length
      ? options.breadcrumbTrail
      : (state.breadcrumbs.length ? state.breadcrumbs.slice() : [buildSectionBreadcrumb(state.currentSection, byId('pageTitle')?.textContent?.trim() || getSectionTitle(state.currentSection))]);
    const entityCrumb = {
      kind: 'entity',
      label: getEntityBreadcrumbLabel(type, id),
      entityType: type,
      entityId: id
    };
    const previousMatchIndex = sourceTrail.findIndex((item) => item.kind === 'entity' && item.entityType === type && entityMatchKey(type, item.entityId) === entityMatchKey(type, id));
    const breadcrumbTrail = previousMatchIndex >= 0
      ? sourceTrail.slice(0, previousMatchIndex + 1)
      : sourceTrail.concat(entityCrumb).slice(-6);
    state.currentEntity = { type, id };
    state.entitySlider = options.sliderContext || null;
    if (type === 'project') {
      state.selectedProjectId = Number(id);
    } else if (type === 'beneficiary') {
      state.selectedBeneficiaryId = Number(id);
    } else if (type === 'location') {
      state.selectedLocationId = Number(id);
    } else if (type === 'document') {
      state.selectedDocumentId = Number(id);
    } else if (type === 'excel_import') {
      state.selectedExcelImportId = Number(id);
    } else if (type === 'extracted_entry') {
      state.selectedEntryId = Number(id);
    } else if (type === 'activity') {
      state.selectedActivityId = Number(id);
    } else if (type === 'duty') {
      state.selectedDutyId = Number(id);
    } else if (type === 'photo') {
      state.selectedPhotoId = Number(id);
    } else if (type === 'map') {
      state.selectedMapId = Number(id);
    } else if (type === 'timeline') {
      state.selectedTimelineId = Number(id);
    } else if (type === 'report') {
      state.selectedReportId = Number(id);
    }
    switchSection('entitySection', 'Entity Explorer', { preserveBreadcrumbs: true, breadcrumbs: breadcrumbTrail });
    renderEntityPage();
  }

  function getLinkedProjectBundle(projectId) {
    return {
      project: getProjectById(projectId),
      beneficiaries: getBootstrapArray('beneficiaries').filter((item) => (item.projectIds || []).includes(projectId) || (getProjectById(projectId)?.beneficiaryIds || []).includes(item.id)),
      locations: getBootstrapArray('locations').filter((item) => (getProjectById(projectId)?.locationIds || []).includes(item.id)),
      projectItems: deriveProjectItemRecords().filter((item) => item.projectId === projectId),
      documents: getBootstrapArray('documents').filter((item) => item.relatedProjectId === projectId),
      excelImports: getBootstrapArray('excelImports').filter((item) => item.relatedProjectId === projectId),
      entries: getBootstrapArray('extractedEntries').filter((item) => item.projectId === projectId),
      photos: getBootstrapArray('photos').filter((item) => item.projectId === projectId),
      maps: getBootstrapArray('maps').filter((item) => item.projectId === projectId),
      activities: getBootstrapArray('activities').filter((item) => item.projectId === projectId),
      duties: getBootstrapArray('duties').filter((item) => item.projectId === projectId),
      timeline: getBootstrapArray('timelineEntries').filter((item) => item.projectId === projectId),
      reports: getBootstrapArray('reports').filter((item) => item.projectId === projectId)
    };
  }

  function getLinkedBeneficiaryBundle(beneficiaryId) {
    return {
      beneficiary: getBeneficiaryById(beneficiaryId),
      projects: getBootstrapArray('projects').filter((item) => (item.beneficiaryIds || []).includes(beneficiaryId)),
      locations: getBootstrapArray('locations').filter((item) => (getBeneficiaryById(beneficiaryId)?.locationIds || []).includes(item.id)),
      projectItems: deriveProjectItemRecords().filter((item) => item.relatedBeneficiaryId === beneficiaryId),
      documents: getBootstrapArray('documents').filter((item) => item.beneficiaryId === beneficiaryId),
      photos: getBootstrapArray('photos').filter((item) => item.beneficiaryId === beneficiaryId),
      maps: getBootstrapArray('maps').filter((item) => item.beneficiaryId === beneficiaryId),
      activities: getBootstrapArray('activities').filter((item) => item.beneficiaryId === beneficiaryId),
      duties: getBootstrapArray('duties').filter((item) => item.assignedBeneficiaryId === beneficiaryId),
      entries: getBootstrapArray('extractedEntries').filter((item) => item.beneficiaryId === beneficiaryId),
      timeline: getBootstrapArray('timelineEntries').filter((item) => item.beneficiaryId === beneficiaryId),
      reports: getBootstrapArray('reports').filter((item) => item.beneficiaryId === beneficiaryId)
    };
  }

  function getLinkedLocationBundle(locationId) {
    return {
      location: getLocationById(locationId),
      projects: getBootstrapArray('projects').filter((item) => (item.locationIds || []).includes(locationId)),
      beneficiaries: getBootstrapArray('beneficiaries').filter((item) => (item.locationIds || []).includes(locationId)),
      projectItems: deriveProjectItemRecords().filter((item) => item.relatedLocationId === locationId),
      documents: getBootstrapArray('documents').filter((item) => item.locationId === locationId),
      photos: getBootstrapArray('photos').filter((item) => item.locationId === locationId),
      maps: getBootstrapArray('maps').filter((item) => item.locationId === locationId),
      activities: getBootstrapArray('activities').filter((item) => item.locationId === locationId),
      duties: getBootstrapArray('duties').filter((item) => item.locationId === locationId),
      entries: getBootstrapArray('extractedEntries').filter((item) => item.locationId === locationId),
      timeline: getBootstrapArray('timelineEntries').filter((item) => item.locationId === locationId),
      reports: getBootstrapArray('reports').filter((item) => item.locationId === locationId)
    };
  }

  function getLinkedProjectCategoryBundle(categoryId) {
    const category = getCategoryById(categoryId);
    const projects = getBootstrapArray('projects').filter((item) => Number(item.categoryId) === Number(categoryId));
    const projectIds = projects.map((item) => Number(item.id));
    const beneficiaries = uniqueEntities(projects.flatMap((project) => (project.beneficiaryIds || []).map((id) => getBeneficiaryById(id))).filter(Boolean));
    const locations = uniqueEntities(projects.flatMap((project) => (project.locationIds || []).map((id) => getLocationById(id))).filter(Boolean));
    const activities = getBootstrapArray('activities').filter((item) => Number(item.categoryId) === Number(categoryId) || projectIds.includes(Number(item.projectId || 0)));
    const activityIds = activities.map((item) => Number(item.id));
    const projectItems = deriveProjectItemRecords().filter((item) => Number(item.categoryId) === Number(categoryId) || projectIds.includes(Number(item.projectId || 0)));
    const duties = getBootstrapArray('duties').filter((item) => projectIds.includes(Number(item.projectId || 0)));
    const documents = getBootstrapArray('documents').filter((item) => Number(item.categoryId) === Number(categoryId) || projectIds.includes(Number(item.relatedProjectId || 0)) || activityIds.includes(Number(item.activityId || 0)));
    const documentIds = documents.map((item) => Number(item.id));
    const excelImports = getBootstrapArray('excelImports').filter((item) => projectIds.includes(Number(item.relatedProjectId || 0)) || documentIds.includes(Number(item.documentId || 0)));
    const excelImportIds = excelImports.map((item) => Number(item.id));
    const photos = getBootstrapArray('photos').filter((item) => projectIds.includes(Number(item.projectId || 0)) || activityIds.includes(Number(item.activityId || 0)) || documentIds.includes(Number(item.documentId || 0)));
    const photoIds = photos.map((item) => Number(item.id));
    const maps = getBootstrapArray('maps').filter((item) => projectIds.includes(Number(item.projectId || 0)) || activityIds.includes(Number(item.activityId || 0)));
    const reports = getBootstrapArray('reports').filter((item) => projectIds.includes(Number(item.projectId || 0)) || activityIds.includes(Number(item.activityId || 0)) || excelImportIds.includes(Number(item.excelImportId || 0)));
    const reportIds = reports.map((item) => Number(item.id));
    const entries = getBootstrapArray('extractedEntries').filter((item) => Number(item.categoryId) === Number(categoryId) || projectIds.includes(Number(item.projectId || 0)) || activityIds.includes(Number(item.activityId || 0)) || excelImportIds.includes(Number(item.excelImportId || 0)) || documentIds.includes(Number(item.documentId || 0)));
    const beneficiaryIds = beneficiaries.map((item) => Number(item.id));
    const locationIds = locations.map((item) => Number(item.id));
    const timeline = getBootstrapArray('timelineEntries').filter((item) => (
      projectIds.includes(Number(item.projectId || 0))
      || beneficiaryIds.includes(Number(item.beneficiaryId || 0))
      || locationIds.includes(Number(item.locationId || 0))
      || activityIds.includes(Number(item.activityId || 0))
      || documentIds.includes(Number(item.documentId || 0))
      || photoIds.includes(Number(item.photoId || 0))
      || excelImportIds.includes(Number(item.excelImportId || 0))
      || reportIds.includes(Number(item.reportId || 0))
    ));
    return {
      category,
      projects,
      beneficiaries,
      locations,
      activities,
      projectItems,
      duties,
      documents,
      excelImports,
      photos,
      maps,
      reports,
      entries,
      timeline
    };
  }

  function getLinkedActivityBundle(activityId) {
    const activity = getActivityById(activityId);
    return {
      activity,
      project: activity && activity.projectId ? getProjectById(activity.projectId) : null,
      beneficiary: activity && activity.beneficiaryId ? getBeneficiaryById(activity.beneficiaryId) : null,
      location: activity && activity.locationId ? getLocationById(activity.locationId) : null,
      documents: getBootstrapArray('documents').filter((item) => item.activityId === activityId),
      photos: getBootstrapArray('photos').filter((item) => item.activityId === activityId),
      maps: getBootstrapArray('maps').filter((item) => item.activityId === activityId),
      entries: getBootstrapArray('extractedEntries').filter((item) => item.activityId === activityId),
      timeline: getBootstrapArray('timelineEntries').filter((item) => item.activityId === activityId),
      reports: getBootstrapArray('reports').filter((item) => item.activityId === activityId)
    };
  }

  function getLinkedDutyBundle(dutyId) {
    const duty = getDutyById(dutyId);
    const linkedActivityIds = new Set();
    const relationshipMatch = (item) => (
      (duty?.projectId && item.projectId === duty.projectId)
      || (duty?.assignedBeneficiaryId && (item.beneficiaryId === duty.assignedBeneficiaryId || item.assignedBeneficiaryId === duty.assignedBeneficiaryId || item.relatedBeneficiaryId === duty.assignedBeneficiaryId))
      || (duty?.locationId && (item.locationId === duty.locationId || item.relatedLocationId === duty.locationId))
    );
    const activities = getBootstrapArray('activities').filter((item) => relationshipMatch(item)).slice(0, 8);
    activities.forEach((item) => linkedActivityIds.add(item.id));
    const allCalendarEvents = deriveCalendarEvents();
    return {
      duty,
      project: duty && duty.projectId ? getProjectById(duty.projectId) : null,
      beneficiary: duty && duty.assignedBeneficiaryId ? getBeneficiaryById(duty.assignedBeneficiaryId) : null,
      location: duty && duty.locationId ? getLocationById(duty.locationId) : null,
      user: duty && duty.assignedUserId ? getUserById(duty.assignedUserId) : null,
      activities,
      documents: getBootstrapArray('documents').filter((item) => relationshipMatch(item) || (item.activityId && linkedActivityIds.has(item.activityId))).slice(0, 8),
      photos: getBootstrapArray('photos').filter((item) => relationshipMatch(item) || (item.activityId && linkedActivityIds.has(item.activityId))).slice(0, 8),
      maps: getBootstrapArray('maps').filter((item) => item.dutyId === dutyId || relationshipMatch(item) || (item.activityId && linkedActivityIds.has(item.activityId))).slice(0, 8),
      entries: getBootstrapArray('extractedEntries').filter((item) => relationshipMatch(item) || (item.activityId && linkedActivityIds.has(item.activityId))).slice(0, 8),
      reports: getBootstrapArray('reports').filter((item) => relationshipMatch(item) || (item.activityId && linkedActivityIds.has(item.activityId))).slice(0, 8),
      projectItems: deriveProjectItemRecords().filter((item) => relationshipMatch(item)).slice(0, 8),
      distributionEvents: allCalendarEvents.filter((item) => item.eventType === 'item_distribution' && relationshipMatch(item)).slice(0, 8),
      calendarEvents: allCalendarEvents.filter((item) => item.dutyId === dutyId || relationshipMatch(item)).slice(0, 12),
      timeline: getBootstrapArray('timelineEntries').filter((item) => (
        (duty?.projectId && item.projectId === duty.projectId)
        || (duty?.assignedBeneficiaryId && item.beneficiaryId === duty.assignedBeneficiaryId)
        || (duty?.locationId && item.locationId === duty.locationId)
      )).slice(0, 12),
      relatedDuties: getBootstrapArray('duties').filter((item) => item.id !== dutyId && (
        (duty?.projectId && item.projectId === duty.projectId)
        || (duty?.assignedBeneficiaryId && item.assignedBeneficiaryId === duty.assignedBeneficiaryId)
        || (duty?.locationId && item.locationId === duty.locationId)
      )).slice(0, 8)
    };
  }

  function getLinkedProjectItemBundle(itemId) {
    const item = getProjectItemById(itemId);
    if (!item) {
      return {
        item: null,
        project: null,
        beneficiary: null,
        location: null,
        subItems: [],
        siblingItems: [],
        maps: [],
        activities: [],
        duties: [],
        documents: [],
        photos: [],
        entries: [],
        timeline: [],
        reports: [],
        distributionEvents: [],
        calendarEvents: []
      };
    }
    const allCalendarEvents = deriveCalendarEvents();
    const relationshipMatch = (entry) => (
      (item.projectId && entry.projectId === item.projectId)
      || (item.relatedBeneficiaryId && entry.beneficiaryId === item.relatedBeneficiaryId)
      || (item.relatedLocationId && entry.locationId === item.relatedLocationId)
    );
    return {
      item,
      project: item.projectId ? getProjectById(item.projectId) : null,
      beneficiary: item.relatedBeneficiaryId ? getBeneficiaryById(item.relatedBeneficiaryId) : null,
      location: item.relatedLocationId ? getLocationById(item.relatedLocationId) : null,
      subItems: getProjectItemSubItems(item),
      siblingItems: deriveProjectItemRecords().filter((candidate) => Number(candidate.id) !== Number(item.id) && (
        (item.projectId && candidate.projectId === item.projectId)
        || (item.relatedBeneficiaryId && candidate.relatedBeneficiaryId === item.relatedBeneficiaryId)
        || (item.relatedLocationId && candidate.relatedLocationId === item.relatedLocationId)
      )).slice(0, 12),
      maps: getBootstrapArray('maps').filter((entry) => relationshipMatch(entry)),
      activities: getBootstrapArray('activities').filter((entry) => relationshipMatch(entry)),
      duties: getBootstrapArray('duties').filter((entry) => relationshipMatch(entry)),
      documents: getBootstrapArray('documents').filter((entry) => relationshipMatch(entry)),
      photos: getBootstrapArray('photos').filter((entry) => relationshipMatch(entry)),
      entries: getBootstrapArray('extractedEntries').filter((entry) => relationshipMatch(entry)).slice(0, 12),
      timeline: getBootstrapArray('timelineEntries').filter((entry) => relationshipMatch(entry)).slice(0, 12),
      reports: getBootstrapArray('reports').filter((entry) => relationshipMatch(entry)),
      distributionEvents: allCalendarEvents.filter((entry) => entry.eventType === 'item_distribution' && (Number(entry.itemId) === Number(item.id) || relationshipMatch(entry))).slice(0, 12),
      calendarEvents: allCalendarEvents.filter((entry) => Number(entry.itemId) === Number(item.id) || relationshipMatch(entry)).slice(0, 12)
    };
  }

  function getLinkedMapBundle(mapId) {
    const mapRecord = getMapById(mapId);
    const relationshipMatch = (item) => {
      if (!mapRecord || !item) {
        return false;
      }
      return (
        (mapRecord.projectId && item.projectId === mapRecord.projectId)
        || (mapRecord.beneficiaryId && item.beneficiaryId === mapRecord.beneficiaryId)
        || (mapRecord.locationId && item.locationId === mapRecord.locationId)
        || (mapRecord.activityId && item.activityId === mapRecord.activityId)
        || (mapRecord.dutyId && item.dutyId === mapRecord.dutyId)
        || (mapRecord.documentId && item.documentId === mapRecord.documentId)
        || (mapRecord.previewPhotoId && item.photoId === mapRecord.previewPhotoId)
      );
    };
    const relatedMaps = getBootstrapArray('maps').filter((item) => item.id !== mapId && relationshipMatch(item)).slice(0, 8);
    const timeline = getBootstrapArray('timelineEntries').filter((item) => relationshipMatch(item)).slice(0, 12);
    const documents = uniqueEntities(getBootstrapArray('documents').filter((item) => (
      (mapRecord?.documentId && item.id === mapRecord.documentId)
      || relationshipMatch(item)
    )));
    const photos = uniqueEntities(getBootstrapArray('photos').filter((item) => (
      (mapRecord?.previewPhotoId && item.id === mapRecord.previewPhotoId)
      || relationshipMatch(item)
    )));
    const activities = uniqueEntities(getBootstrapArray('activities').filter((item) => (
      (mapRecord?.activityId && item.id === mapRecord.activityId)
      || relationshipMatch(item)
    )));
    const duties = uniqueEntities(getBootstrapArray('duties').filter((item) => (
      (mapRecord?.dutyId && item.id === mapRecord.dutyId)
      || relationshipMatch(item)
    )));
    const reports = uniqueEntities(getBootstrapArray('reports').filter((item) => relationshipMatch(item)));
    const projectIds = new Set([
      mapRecord?.projectId,
      ...documents.map((item) => item.relatedProjectId),
      ...photos.map((item) => item.projectId),
      ...activities.map((item) => item.projectId),
      ...duties.map((item) => item.projectId),
      ...reports.map((item) => item.projectId),
      ...relatedMaps.map((item) => item.projectId),
      ...timeline.map((item) => item.projectId)
    ].filter(Boolean).map((value) => Number(value)));
    const beneficiaryIds = new Set([
      mapRecord?.beneficiaryId,
      ...documents.map((item) => item.beneficiaryId),
      ...photos.map((item) => item.beneficiaryId),
      ...reports.map((item) => item.beneficiaryId),
      ...relatedMaps.map((item) => item.beneficiaryId),
      ...timeline.map((item) => item.beneficiaryId)
    ].filter(Boolean).map((value) => Number(value)));
    const locationIds = new Set([
      mapRecord?.locationId,
      ...documents.map((item) => item.locationId),
      ...photos.map((item) => item.locationId),
      ...activities.map((item) => item.locationId),
      ...duties.map((item) => item.locationId),
      ...reports.map((item) => item.locationId),
      ...relatedMaps.map((item) => item.locationId),
      ...timeline.map((item) => item.locationId)
    ].filter(Boolean).map((value) => Number(value)));
    const projects = uniqueEntities(Array.from(projectIds).map((id) => getProjectById(id)).filter(Boolean));
    const beneficiaries = uniqueEntities(Array.from(beneficiaryIds).map((id) => getBeneficiaryById(id)).filter(Boolean));
    const locations = uniqueEntities(Array.from(locationIds).map((id) => getLocationById(id)).filter(Boolean));
    const categories = uniqueEntities(projects.map((item) => item?.categoryId ? getCategoryById(item.categoryId) : null).filter(Boolean));
    return {
      map: mapRecord,
      project: projects[0] || null,
      beneficiary: beneficiaries[0] || null,
      location: locations[0] || null,
      activity: activities[0] || null,
      duty: duties[0] || null,
      document: documents[0] || null,
      photo: photos[0] || null,
      projects,
      beneficiaries,
      locations,
      activities,
      duties,
      documents,
      photos,
      reports,
      categories,
      relatedMaps,
      timeline
    };
  }

  function getLinkedDocumentBundle(documentId) {
    const documentRecord = getDocumentById(documentId);
    return {
      document: documentRecord,
      project: documentRecord && documentRecord.relatedProjectId ? getProjectById(documentRecord.relatedProjectId) : null,
      beneficiary: documentRecord && documentRecord.beneficiaryId ? getBeneficiaryById(documentRecord.beneficiaryId) : null,
      location: documentRecord && documentRecord.locationId ? getLocationById(documentRecord.locationId) : null,
      activity: documentRecord && documentRecord.activityId ? getActivityById(documentRecord.activityId) : null,
      excelImports: getBootstrapArray('excelImports').filter((item) => item.documentId === documentId),
      photos: getBootstrapArray('photos').filter((item) => item.documentId === documentId),
      entries: getBootstrapArray('extractedEntries').filter((item) => item.documentId === documentId),
      timeline: getBootstrapArray('timelineEntries').filter((item) => item.documentId === documentId),
      reports: getBootstrapArray('reports').filter((item) => (
        (documentRecord?.relatedProjectId && item.projectId === documentRecord.relatedProjectId)
        || (documentRecord?.beneficiaryId && item.beneficiaryId === documentRecord.beneficiaryId)
        || (documentRecord?.locationId && item.locationId === documentRecord.locationId)
        || (documentRecord?.activityId && item.activityId === documentRecord.activityId)
      ))
    };
  }

  function getLinkedPhotoBundle(photoId) {
    const photo = getPhotoById(photoId);
    const relatedPhotos = uniqueEntities(getBootstrapArray('photos').filter((item) => photoRelationsMatch(photo, item)));
    return {
      photo,
      document: photo && photo.documentId ? getDocumentById(photo.documentId) : null,
      project: photo && photo.projectId ? getProjectById(photo.projectId) : null,
      beneficiary: photo && photo.beneficiaryId ? getBeneficiaryById(photo.beneficiaryId) : null,
      location: photo && photo.locationId ? getLocationById(photo.locationId) : null,
      activity: photo && photo.activityId ? getActivityById(photo.activityId) : null,
      relatedPhotos,
      entries: uniqueEntities(getBootstrapArray('extractedEntries').filter((item) => photoLinkedItemMatch(photo, item))),
      reports: uniqueEntities(getBootstrapArray('reports').filter((item) => photoLinkedItemMatch(photo, item))),
      timeline: getBootstrapArray('timelineEntries').filter((item) => item.photoId === photoId || photoLinkedItemMatch(photo, item))
    };
  }

  function getLinkedEntryBundle(entryId) {
    const entry = getEntryById(entryId);
    return {
      entry,
      excelImport: entry && entry.excelImportId ? getExcelImportById(entry.excelImportId) : null,
      project: entry && entry.projectId ? getProjectById(entry.projectId) : null,
      beneficiary: entry && entry.beneficiaryId ? getBeneficiaryById(entry.beneficiaryId) : null,
      location: entry && entry.locationId ? getLocationById(entry.locationId) : null,
      activity: entry && entry.activityId ? getActivityById(entry.activityId) : null,
      document: entry && entry.documentId ? getDocumentById(entry.documentId) : null,
      timeline: getBootstrapArray('timelineEntries').filter((item) => item.excelImportId === entry?.excelImportId || item.projectId === entry?.projectId || item.activityId === entry?.activityId)
    };
  }

  function getLinkedTimelineBundle(timelineId) {
    const timeline = getTimelineById(timelineId);
    return {
      timeline,
      project: timeline && timeline.projectId ? getProjectById(timeline.projectId) : null,
      beneficiary: timeline && timeline.beneficiaryId ? getBeneficiaryById(timeline.beneficiaryId) : null,
      location: timeline && timeline.locationId ? getLocationById(timeline.locationId) : null,
      activity: timeline && timeline.activityId ? getActivityById(timeline.activityId) : null,
      document: timeline && timeline.documentId ? getDocumentById(timeline.documentId) : null,
      photo: timeline && timeline.photoId ? getPhotoById(timeline.photoId) : null,
      excelImport: timeline && timeline.excelImportId ? getExcelImportById(timeline.excelImportId) : null,
      report: timeline && timeline.reportId ? getReportById(timeline.reportId) : null,
      relatedTimeline: getBootstrapArray('timelineEntries').filter((item) => item.id !== timelineId && ((timeline?.projectId && item.projectId === timeline.projectId) || (timeline?.beneficiaryId && item.beneficiaryId === timeline.beneficiaryId) || (timeline?.locationId && item.locationId === timeline.locationId))).slice(0, 8)
    };
  }

  function getLinkedReportBundle(reportId) {
    const report = getReportById(reportId);
    return {
      report,
      project: report && report.projectId ? getProjectById(report.projectId) : null,
      beneficiary: report && report.beneficiaryId ? getBeneficiaryById(report.beneficiaryId) : null,
      location: report && report.locationId ? getLocationById(report.locationId) : null,
      activity: report && report.activityId ? getActivityById(report.activityId) : null,
      excelImport: report && report.excelImportId ? getExcelImportById(report.excelImportId) : null,
      timeline: getBootstrapArray('timelineEntries').filter((item) => item.reportId === reportId || item.projectId === report?.projectId || item.beneficiaryId === report?.beneficiaryId || item.locationId === report?.locationId).slice(0, 8)
    };
  }

  function projectTile(item) {
    return entityTileHtml({
      type: 'project',
      id: item.id,
      title: item.title,
      details: [
        item.categoryName || 'Project page',
        item.county || item.village || item.location || '',
        item.summary || item.description || ''
      ],
      badges: [item.status, item.projectStage].filter(Boolean)
    });
  }

  function projectCategoryTile(item) {
    if (!item) {
      return '';
    }
    const projectCount = getBootstrapArray('projects').filter((project) => Number(project.categoryId) === Number(item.id)).length;
    return entityTileHtml({
      type: 'project_category',
      id: item.id,
      title: item.name,
      details: [
        item.description || 'Project category page',
        `${projectCount} linked project${projectCount === 1 ? '' : 's'}`
      ],
      badges: ['project_category']
    });
  }

  function beneficiaryTile(item) {
    return entityTileHtml({
      type: 'beneficiary',
      id: item.id,
      title: item.name,
      details: [
        humanise(item.type),
        [item.village, item.ward, item.county].filter(Boolean).join(', '),
        item.contactPerson || item.phone || item.email || ''
      ],
      badges: [item.status || 'active', item.type],
      image: item.profilePhotoPath ? `file:///${escapeHtml(String(item.profilePhotoPath).replace(/\\/g, '/'))}` : ''
    });
  }

  function locationTile(item) {
    return entityTileHtml({
      type: 'location',
      id: item.id,
      title: item.name,
      details: [
        humanise(item.locationType),
        [item.county, item.subCounty, item.ward, item.village].filter(Boolean).join(', '),
        item.physicalDescription || ''
      ],
      badges: [item.locationType]
    });
  }

  function activityTile(item) {
    return entityTileHtml({
      type: 'activity',
      id: item.id,
      title: item.title,
      details: [
        item.activityType ? humanise(item.activityType) : '',
        item.activityDate ? formatDate(item.activityDate) : '',
        item.projectTitle || item.locationName || item.notes || ''
      ],
      badges: [item.activityType, item.status, item.followUpStatus].filter(Boolean)
    });
  }

  function projectItemStoryTile(item) {
    if (!item) {
      return '';
    }
    return entityTileHtml({
      type: 'project_item',
      id: item.id,
      title: [item.itemType, item.itemSubtype].filter(Boolean).join(' - ') || 'Project item',
      details: [
        item.projectTitle || 'Project item record',
        buildDistributedItemSummary(item),
        item.beneficiaryName || item.locationName || ''
      ],
      badges: [item.categoryName, item.status].filter(Boolean)
    });
  }

  function dutyTile(item) {
    return entityTileHtml({
      type: 'duty',
      id: item.id,
      title: item.title,
      details: [
        item.dutyType ? humanise(item.dutyType) : '',
        item.dueDate ? `Due ${formatDate(item.dueDate)}` : formatDate(item.assignedDate || item.createdAt),
        item.projectTitle || item.locationName || item.notes || ''
      ],
      badges: [item.dutyType, item.status, item.priority].filter(Boolean)
    });
  }

  function documentTile(item) {
    return entityTileHtml({
      type: 'document',
      id: item.id,
      title: item.originalFilename,
      details: [
        `Document ${item.id}`,
        item.projectTitle || item.locationName || item.beneficiaryName || '',
        item.description || ''
      ],
      badges: [item.documentStatus, item.extractionStatus, item.fileExtension].filter(Boolean)
    });
  }

  function photoTile(item) {
    return entityTileHtml({
      type: 'photo',
      id: item.id,
      title: item.title,
      details: [
        humanise(item.category || 'general_evidence'),
        item.projectTitle || item.locationName || item.beneficiaryName || '',
        item.description || ''
      ],
      badges: [item.category, item.status].filter(Boolean),
      image: entityPreviewImage(item)
    });
  }

  function mapPreviewUrl(item) {
    if (!item) {
      return '';
    }
    if (item.storagePath) {
      return `file:///${escapeHtml(String(item.storagePath).replace(/\\/g, '/'))}`;
    }
    if (item.staticImageUrl) {
      return item.staticImageUrl;
    }
    return '';
  }

  function deriveMapEmbedSrc(item) {
    if (!item) {
      return '';
    }
    if (item.embedSrc) {
      return item.embedSrc;
    }
    const latitude = String(item.latitude || '').trim();
    const longitude = String(item.longitude || '').trim();
    const centreQuery = String(item.centreQuery || '').trim();
    const centre = latitude && longitude ? `${latitude},${longitude}` : centreQuery;
    if (!centre) {
      return '';
    }
    const params = new URLSearchParams({
      q: centre,
      z: String(item.zoomLevel || '14').trim() || '14',
      output: 'embed'
    });
    return `https://www.google.com/maps?${params.toString()}`;
  }

  function renderMapPreview(item, options = {}) {
    const previewUrl = mapPreviewUrl(item);
    if (previewUrl) {
      return `<img src="${escapeHtml(previewUrl)}" alt="${escapeHtml(item.title || 'Map preview')}" class="${escapeHtml(options.className || '')}">`;
    }
    const embedSrc = deriveMapEmbedSrc(item);
    if (embedSrc) {
      return `<iframe src="${escapeHtml(embedSrc)}" title="${escapeHtml(item.title || 'Map embed preview')}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
    }
    return '<div class="empty-state">No map preview stored yet.</div>';
  }

  function mapTile(item) {
    return entityTileHtml({
      type: 'map',
      id: item.id,
      title: item.title,
      details: [
        humanise(item.sourceType || 'reference_only'),
        item.locationName || item.projectTitle || item.dutyTitle || '',
        item.notes || ''
      ],
      badges: [item.provider, item.status].filter(Boolean),
      mediaHtml: `<div class="entity-media-preview entity-tile-image entity-tile-map-media">${renderMapPreview(item, { className: 'entity-tile-map-preview' })}</div>`,
      openLabel: 'Open full map page'
    });
  }

  function renderEntityPhotoGallery(photos, emptyText) {
    return `
      <div class="entity-photo-gallery-panel">
        <div class="section-heading compact">
          <h4>Linked photo gallery</h4>
        </div>
        ${photos.length ? `
          <div class="entity-photo-gallery">
            ${photos.map((photo) => `
              <article class="entity-photo-gallery-card">
                <div class="entity-media-preview">
                  ${photo.storagePath ? `<img src="${entityPreviewImage(photo)}" alt="${escapeHtml(photo.title)}">` : '<div class="empty-state">No image preview</div>'}
                </div>
                <div class="entity-photo-gallery-body">
                  <strong>${escapeHtml(photo.title || 'Untitled image')}</strong>
                  <p class="entity-photo-gallery-description">${escapeHtml(photo.description || 'No photo description recorded.')}</p>
                  <div class="meta-badges">${badgeHtml(photo.category || 'general_evidence')} ${photo.photoDate ? badgeHtml(formatDate(photo.photoDate)) : ''}</div>
                  ${renderPhotoLinkedSummary(photo)}
                  ${relatedPhotoQuickLinks(photo).length ? `
                    <div class="entity-related-mini-links">
                      ${relatedPhotoQuickLinks(photo).map((link) => `
                        <button type="button" class="micro-link-button" data-entity-type="${escapeHtml(link.type)}" data-entity-id="${escapeHtml(encodeEntityId(link.type, link.id))}">${escapeHtml(link.label)}</button>
                      `).join('')}
                    </div>
                  ` : ''}
                  <button type="button" class="inline-button entity-link-action" data-entity-type="photo" data-entity-id="${escapeHtml(encodeEntityId('photo', photo.id))}">Open full page</button>
                </div>
              </article>
            `).join('')}
          </div>
        ` : `<div class="empty-state">${escapeHtml(emptyText || 'No linked photo evidence yet.')}</div>`}
      </div>
    `;
  }

  function excelImportTile(item) {
    return entityTileHtml({
      type: 'excel_import',
      id: item.id,
      title: item.originalFilename,
      details: [
        `${item.rowsExtracted || 0} extracted rows`,
        `${item.sheetCount || 0} sheets`,
        item.description || ''
      ],
      badges: [item.importStatus, `${item.sheetCount || 0} sheets`]
    });
  }

  function extractedEntryTile(item) {
    return entityTileHtml({
      type: 'extracted_entry',
      id: item.id,
      title: `Row ${item.sourceRowNumber || item.id}`,
      details: [
        item.sourceSheetName || item.documentName || 'Extracted entry',
        item.assignedRecordType ? humanise(item.assignedRecordType) : '',
        item.cleanedText || item.rawText || ''
      ],
      badges: [item.status, item.conversionStatus, item.assignedRecordType].filter(Boolean)
    });
  }

  function timelineTile(item) {
    return entityTileHtml({
      type: 'timeline',
      id: item.id,
      title: item.title,
      details: [
        formatDate(item.entryDate),
        humanise(item.entryType || 'timeline'),
        item.description || ''
      ],
      badges: [item.entryType, item.projectTitle || item.locationName || item.beneficiaryName].filter(Boolean)
    });
  }

  function reportTile(item) {
    return entityTileHtml({
      type: 'report',
      id: item.id,
      title: item.reportTitle,
      details: [
        humanise(item.reportType),
        formatDateTime(item.createdAt),
        item.projectTitle || item.beneficiaryName || item.locationName || ''
      ],
      badges: [item.reportType]
    });
  }

  function buildProjectCategoryStoryPage(bundle) {
    const category = bundle.category;
    if (!category) {
      return '<div class="empty-state">Project category not found.</div>';
    }
    return `
      <div class="entity-dossier entity-page-shell">
        <div class="dossier-header">
          <div>
            <p class="eyebrow">Project category dossier</p>
            <h3>${escapeHtml(category.name)}</h3>
            <p>${escapeHtml(category.description || 'No category description recorded yet.')}</p>
          </div>
          <div class="meta-badges">${badgeHtml('project_category')} ${badgeHtml(`${bundle.projects.length} projects`)}</div>
        </div>
        ${renderStoryCallout(`${category.name} currently coordinates ${bundle.projects.length} projects, ${bundle.activities.length} activities, ${bundle.projectItems.length} project item rows, ${bundle.documents.length} documents, ${bundle.maps.length} maps, ${bundle.reports.length} reports, and ${bundle.timeline.length} timeline entries.`)}
        <div class="entity-command-bar">
          <button type="button" class="entity-deep-link" data-open-section="categoriesSection" data-section-title="Project Categories">Return to Project Categories</button>
        </div>
        ${renderDetailCards([
          { label: 'Category name', value: category.name },
          { label: 'Description', value: category.description || 'Not recorded' },
          { label: 'Projects under this category', value: String(bundle.projects.length) },
          { label: 'Activities under this category', value: String(bundle.activities.length) },
          { label: 'Project item rows', value: String(bundle.projectItems.length) },
          { label: 'Evidence records', value: String(bundle.documents.length + bundle.photos.length) },
          { label: 'Reports', value: String(bundle.reports.length) },
          { label: 'Timeline entries', value: String(bundle.timeline.length) }
        ])}
        <div class="linked-grid">
          ${renderEntityGroup('Projects under this category', bundle.projects.map(projectTile), 'No projects saved under this category yet.', 'story-grid')}
          ${renderEntityGroup('Beneficiaries reached through this category', bundle.beneficiaries.map(beneficiaryTile), 'No linked beneficiaries yet.')}
          ${renderEntityGroup('Locations linked to this category', bundle.locations.map(locationTile), 'No linked locations yet.')}
          ${renderEntityGroup('Activities under this category', bundle.activities.map(activityTile), 'No linked activities yet.')}
          ${renderEntityGroup('Project item rows under this category', bundle.projectItems.map(projectItemStoryTile), 'No linked project item rows yet.')}
          ${renderEntityGroup('Maps and spatial evidence', bundle.maps.map(mapTile), 'No linked maps yet.')}
          ${renderEntityGroup('Documents, imports, and photo evidence', bundle.documents.map(documentTile).concat(bundle.excelImports.map(excelImportTile)).concat(bundle.photos.map(photoTile)), 'No linked evidence yet.')}
          ${renderEntityGroup('Extracted rows and reports', bundle.entries.map(extractedEntryTile).concat(bundle.reports.map(reportTile)), 'No linked extracted rows or reports yet.')}
          ${renderEntityGroup('Duties and assignments', bundle.duties.map(dutyTile), 'No linked duties yet.')}
        </div>
        ${renderEntityGroup('Timeline and history', bundle.timeline.map(timelineTile), 'No timeline entries yet.', 'story-grid')}
      </div>
    `;
  }

  function buildProjectStoryPage(bundle) {
    const project = bundle.project;
    if (!project) {
      return '<div class="empty-state">Project not found.</div>';
    }
    const projectCategory = getCategoryById(project.categoryId);
    const trailTiles = buildLocationTrail(project);
    const featuredPhoto = pickTaggedPhoto(bundle.photos, 'profile_photo');
    const featuredDocument = pickTaggedDocument(bundle.documents, 'reference_document');
    return `
      <div class="entity-dossier entity-page-shell">
        <div class="dossier-header">
          <div>
            <p class="eyebrow">Project dossier</p>
            <h3>${escapeHtml(project.title)}</h3>
            <p>${escapeHtml(project.summary || project.backgroundStory || project.description || 'No project story recorded yet.')}</p>
          </div>
          <div class="meta-badges">${badgeHtml(project.status)} ${project.categoryName ? badgeHtml(project.categoryName) : ''}</div>
        </div>
        ${renderEntitySliderBar('project', project.id)}
        ${renderStoryCallout(`${project.title} is connected to ${bundle.beneficiaries.length} beneficiaries, ${bundle.locations.length} saved locations, ${bundle.activities.length} activities, ${bundle.duties.length} duties, ${bundle.maps.length} maps, ${bundle.timeline.length} timeline events, ${bundle.documents.length} documents, ${bundle.photos.length} photo evidence items, and ${bundle.entries.length} extracted Excel rows.`)}
        <div class="entity-command-bar">
          <button type="button" class="entity-deep-link" data-open-section="projectsSection" data-section-title="Projects">Return to Projects register</button>
        </div>
        ${renderEntityHero(featuredPhoto, featuredDocument, 'No project cover image yet.', { contained: true })}
        ${renderCycleIntelligencePanel('project', bundle)}
        <div>
          ${renderDetailCards([
            { label: 'Project code', value: project.projectCode || 'Not recorded' },
            { label: 'Category', value: project.categoryName || 'Not assigned' },
            { label: 'Project stage', value: project.projectStage || 'Not recorded' },
            { label: 'Project officer', value: project.projectOfficer || 'Not recorded' },
            { label: 'Administrative hierarchy', value: [project.county, project.subCounty, project.ward, project.village].filter(Boolean).join(', ') || 'Not recorded' },
            { label: 'Coordinates', value: project.latitude && project.longitude ? `${project.latitude}, ${project.longitude}` : 'Not recorded' },
            { label: 'Dates', value: [project.dateStarted && `Started ${formatDate(project.dateStarted)}`, project.dateCompleted && `Completed ${formatDate(project.dateCompleted)}`].filter(Boolean).join(' | ') || 'Not recorded' },
            { label: 'Funding and budget', value: [project.donorName, project.budgetAmount && `Budget ${project.budgetAmount}`, project.actualCost && `Actual ${project.actualCost}`].filter(Boolean).join(' | ') || 'Not recorded' },
            { label: 'Verification status', value: project.verificationStatus || 'Not recorded' },
            { label: 'Seedling outcomes', value: buildProjectSeedlingSummary(project) },
            { label: 'Story/background', value: project.backgroundStory || 'Not recorded' },
            { label: 'Objective', value: project.objective || 'Not recorded' },
            { label: 'Description', value: project.description || 'Not recorded' },
            { label: 'Notes', value: project.notes || 'Not recorded' },
            { label: 'Tags', value: project.tags || 'Not recorded' }
          ])}
          ${getProjectCustomFieldCards(project).length ? `
            <div class="linked-card">
              <h4>Category-specific fields</h4>
              ${renderDetailCards(getProjectCustomFieldCards(project), 'entry-field-grid')}
            </div>
          ` : ''}
          ${renderDistributedItemCards(project.distributedItems, 'Distributed items and outcomes')}
        </div>
        ${renderEntityGroup('Location hierarchy', trailTiles.concat(bundle.locations.map(locationTile)), 'No saved location hierarchy yet.', 'story-grid')}
        ${renderEntityPhotoGallery(bundle.photos, 'No linked photo evidence yet.')}
        <div class="linked-grid">
          ${renderEntityGroup('Project category', [projectCategoryTile(projectCategory)].filter(Boolean), 'No linked project category.', 'story-grid')}
          ${renderEntityGroup('Linked locations', bundle.locations.map(locationTile), 'No linked locations.')}
          ${renderEntityGroup('Beneficiaries', bundle.beneficiaries.map(beneficiaryTile), 'No linked beneficiaries.')}
          ${renderEntityGroup('Activities', bundle.activities.map(activityTile), 'No linked activities.')}
          ${renderEntityGroup('Assignments and duties', bundle.duties.map(dutyTile), 'No linked duties yet.')}
          ${renderEntityGroup('Project item rows', bundle.projectItems.map(projectItemStoryTile), 'No linked project item rows yet.')}
          ${renderEntityGroup('Maps and spatial evidence', bundle.maps.map(mapTile), 'No linked maps yet.')}
          ${renderEntityGroup('Documents and imports', bundle.documents.map(documentTile).concat(bundle.excelImports.map(excelImportTile)), 'No linked documents or imports.')}
          ${renderEntityGroup('Photo evidence', bundle.photos.map(photoTile), 'No linked photo evidence.')}
          ${renderEntityGroup('Extracted rows', bundle.entries.slice(0, 12).map(extractedEntryTile), 'No linked extracted rows.')}
          ${renderEntityGroup('Reports', bundle.reports.map(reportTile), 'No linked reports yet.')}
        </div>
        ${renderEntityGroup('Timeline and history', bundle.timeline.slice(0, 12).map(timelineTile), 'No timeline entries yet.', 'story-grid')}
      </div>
    `;
  }

  function buildBeneficiaryStoryPage(bundle) {
    const beneficiary = bundle.beneficiary;
    if (!beneficiary) {
      return '<div class="empty-state">Beneficiary not found.</div>';
    }
    const trailTiles = buildLocationTrail(beneficiary);
    const featuredPhoto = pickTaggedPhoto(bundle.photos, 'profile_photo');
    const identityDocument = pickTaggedDocument(bundle.documents, 'identity_document');
    return `
      <div class="entity-dossier entity-page-shell">
        <div class="dossier-header">
          <div>
            <p class="eyebrow">Beneficiary dossier</p>
            <h3>${escapeHtml(beneficiary.name)}</h3>
            <p>${escapeHtml(beneficiary.notes || 'No beneficiary profile notes yet.')}</p>
          </div>
            <div class="meta-badges">${badgeHtml(beneficiary.type)} ${badgeHtml(beneficiary.status || 'active')}</div>
          </div>
          ${renderEntitySliderBar('beneficiary', beneficiary.id)}
          ${renderStoryCallout(`${beneficiary.name} sits inside the wider record cycle through location hierarchy, project participation, field activities, duties, evidence, extracted entries, and timeline history. Open the linked pages in sequence to reconstruct the full history.`)}
        ${renderEntityHero(featuredPhoto, identityDocument, 'No beneficiary profile photo yet.', { contained: true })}
        ${renderCycleIntelligencePanel('beneficiary', bundle)}
        <div>
          ${renderDetailCards([
            { label: 'Reference/code', value: beneficiary.beneficiaryCode || 'Not recorded' },
            { label: 'Status', value: beneficiary.status || 'active' },
            { label: 'Administrative hierarchy', value: [beneficiary.county, beneficiary.subCounty, beneficiary.ward, beneficiary.village].filter(Boolean).join(', ') || 'Not recorded' },
            { label: 'Physical location', value: beneficiary.physicalLocation || 'Not recorded' },
            { label: 'Coordinates', value: beneficiary.latitude && beneficiary.longitude ? `${beneficiary.latitude}, ${beneficiary.longitude}` : 'Not recorded' },
            { label: 'Contact person', value: beneficiary.contactPerson || 'Not recorded' },
            { label: 'Phone', value: beneficiary.phone || 'Not recorded' },
            { label: 'Email', value: beneficiary.email || 'Not recorded' },
            { label: 'Notes', value: beneficiary.notes || 'Not recorded' },
            { label: 'Tags', value: beneficiary.tags || 'Not recorded' }
          ])}
          ${renderDistributedItemCards(beneficiary.distributedItems, 'Items linked to this beneficiary')}
        </div>
        ${renderEntityGroup('Location hierarchy', trailTiles.concat(bundle.locations.map(locationTile)), 'No location hierarchy linked yet.', 'story-grid')}
        ${renderEntityPhotoGallery(bundle.photos, 'No linked photo evidence yet.')}
        <div class="linked-grid">
          ${renderEntityGroup('Linked locations', bundle.locations.map(locationTile), 'No linked locations.')}
          ${renderEntityGroup('Projects', bundle.projects.map(projectTile), 'No linked projects.')}
          ${renderEntityGroup('Activities', bundle.activities.map(activityTile), 'No linked activities.')}
          ${renderEntityGroup('Assignments and duties', bundle.duties.map(dutyTile), 'No linked duties yet.')}
          ${renderEntityGroup('Project item rows', bundle.projectItems.map(projectItemStoryTile), 'No linked project item rows yet.')}
          ${renderEntityGroup('Maps and spatial evidence', bundle.maps.map(mapTile), 'No linked maps yet.')}
          ${renderEntityGroup('Documents', bundle.documents.map(documentTile), 'No linked documents.')}
          ${renderEntityGroup('Photo evidence', bundle.photos.map(photoTile), 'No linked photo evidence.')}
          ${renderEntityGroup('Extracted rows', bundle.entries.slice(0, 12).map(extractedEntryTile), 'No linked extracted rows.')}
          ${renderEntityGroup('Reports', bundle.reports.map(reportTile), 'No linked reports.')}
        </div>
        ${renderEntityGroup('Timeline and history', bundle.timeline.slice(0, 12).map(timelineTile), 'No timeline entries yet.', 'story-grid')}
      </div>
    `;
  }

  function buildLocationStoryPage(bundle) {
    const location = bundle.location;
    if (!location) {
      return '<div class="empty-state">Location not found.</div>';
    }
    const trailTiles = buildLocationTrail(location);
    const featuredPhoto = pickTaggedPhoto(bundle.photos, 'profile_photo');
    const referenceDocument = pickTaggedDocument(bundle.documents, 'reference_document');
    return `
      <div class="entity-dossier entity-page-shell">
        <div class="dossier-header">
          <div>
            <p class="eyebrow">Location dossier</p>
            <h3>${escapeHtml(location.name)}</h3>
            <p>${escapeHtml(location.physicalDescription || location.notes || 'No location description yet.')}</p>
          </div>
            <div class="meta-badges">${badgeHtml(location.locationType)}</div>
          </div>
          ${renderEntitySliderBar('location', location.id)}
          ${renderStoryCallout(`${location.name} anchors ${bundle.projects.length} projects, ${bundle.beneficiaries.length} beneficiaries, ${bundle.activities.length} activities, ${bundle.duties.length} duties, and ${bundle.timeline.length} timeline events inside the connected historical record system.`)}
        ${renderEntityHero(featuredPhoto, referenceDocument, 'No location cover image yet.', { contained: true })}
        ${renderCycleIntelligencePanel('location', bundle)}
        <div>
          ${renderDetailCards([
            { label: 'Administrative hierarchy', value: [location.county, location.subCounty, location.ward, location.village].filter(Boolean).join(', ') || 'Not recorded' },
            { label: 'Coordinates', value: location.latitude && location.longitude ? `${location.latitude}, ${location.longitude}` : 'Not recorded' },
            { label: 'Physical description', value: location.physicalDescription || 'Not recorded' },
            { label: 'Notes', value: location.notes || 'Not recorded' },
            { label: 'Tags', value: location.tags || 'Not recorded' },
            { label: 'Impact snapshot', value: `${bundle.projects.length} projects | ${bundle.beneficiaries.length} beneficiaries | ${bundle.activities.length} activities | ${bundle.duties.length} duties` },
            { label: 'Map link', value: mapLink(location) ? `<a href="${escapeHtml(mapLink(location))}" target="_blank" rel="noreferrer">Open map</a>` : 'Not available', html: true }
          ])}
          ${renderDistributedItemCards(location.distributedItems, 'Items linked to this location')}
        </div>
        ${renderEntityGroup('Administrative pages', trailTiles, 'No administrative hierarchy recorded.', 'story-grid')}
        ${renderEntityPhotoGallery(bundle.photos, 'No linked photo evidence yet.')}
        <div class="linked-grid">
          ${renderEntityGroup('Projects', bundle.projects.map(projectTile), 'No linked projects.')}
          ${renderEntityGroup('Beneficiaries', bundle.beneficiaries.map(beneficiaryTile), 'No linked beneficiaries.')}
          ${renderEntityGroup('Activities', bundle.activities.map(activityTile), 'No linked activities.')}
          ${renderEntityGroup('Assignments and duties', bundle.duties.map(dutyTile), 'No linked duties yet.')}
          ${renderEntityGroup('Project item rows', bundle.projectItems.map(projectItemStoryTile), 'No linked project item rows yet.')}
          ${renderEntityGroup('Maps and spatial evidence', bundle.maps.map(mapTile), 'No linked maps yet.')}
          ${renderEntityGroup('Documents and photos', bundle.documents.map(documentTile).concat(bundle.photos.map(photoTile)), 'No linked evidence.')}
          ${renderEntityGroup('Extracted rows', bundle.entries.slice(0, 12).map(extractedEntryTile), 'No linked extracted rows.')}
          ${renderEntityGroup('Reports', bundle.reports.map(reportTile), 'No linked reports.')}
        </div>
        ${renderEntityGroup('Timeline and history', bundle.timeline.slice(0, 12).map(timelineTile), 'No timeline entries yet.', 'story-grid')}
      </div>
    `;
  }

  function buildActivityStoryPage(bundle) {
    const activity = bundle.activity;
    if (!activity) {
      return '<div class="empty-state">Activity not found.</div>';
    }
    const activityCategory = getCategoryById(activity.categoryId || bundle.project?.categoryId || 0);
    const featuredPhoto = pickTaggedPhoto(bundle.photos, 'profile_photo');
    const referenceDocument = pickTaggedDocument(bundle.documents, 'reference_document');
    return `
      <div class="entity-dossier entity-page-shell">
        <div class="dossier-header">
          <div>
            <p class="eyebrow">Activity dossier</p>
            <h3>${escapeHtml(activity.title)}</h3>
            <p>${escapeHtml(activity.notes || 'No activity notes yet.')}</p>
          </div>
            <div class="meta-badges">${badgeHtml(activity.activityType)} ${activity.status ? badgeHtml(activity.status) : ''} ${activity.followUpStatus ? badgeHtml(activity.followUpStatus) : ''}</div>
          </div>
          ${renderEntitySliderBar('activity', activity.id)}
          ${renderStoryCallout(`${activity.title} is a field event connected to project, beneficiary, location, evidence, extracted data, timeline, and reporting surfaces.`)}
        ${renderEntityHero(featuredPhoto, referenceDocument, 'No activity cover image yet.', { contained: true })}
        ${renderCycleIntelligencePanel('activity', bundle)}
        <div>
          ${renderDetailCards([
            { label: 'Date', value: formatDate(activity.activityDate) },
            { label: 'Category', value: activity.categoryName || 'Not assigned' },
            { label: 'Status', value: humanise(activity.status || 'planned') },
            { label: 'Follow-up status', value: activity.followUpStatus || 'Not recorded' },
            { label: 'Project', value: bundle.project ? bundle.project.title : 'Not linked' },
            { label: 'Beneficiary', value: bundle.beneficiary ? bundle.beneficiary.name : 'Not linked' },
            { label: 'Location', value: bundle.location ? bundle.location.name : 'Not linked' },
            { label: 'Notes', value: activity.notes || 'Not recorded' },
            { label: 'Tags', value: activity.tags || 'Not recorded' }
          ])}
          ${getMetricCards(activity.metricsJson || {}).length ? `
            <div class="linked-card">
              <h4>Recorded metrics</h4>
              ${renderDetailCards(getMetricCards(activity.metricsJson || {}), 'entry-field-grid')}
            </div>
          ` : ''}
        </div>
        <div class="linked-grid">
          ${renderEntityGroup('Project category', [projectCategoryTile(activityCategory)].filter(Boolean), 'No linked project category.', 'story-grid')}
          ${renderEntityGroup('Linked story pages', [bundle.project && projectTile(bundle.project), bundle.beneficiary && beneficiaryTile(bundle.beneficiary), bundle.location && locationTile(bundle.location)].filter(Boolean), 'No linked core records.', 'story-grid')}
          ${renderEntityGroup('Maps and spatial evidence', bundle.maps.map(mapTile), 'No linked maps yet.')}
          ${renderEntityGroup('Documents and evidence', bundle.documents.map(documentTile).concat(bundle.photos.map(photoTile)), 'No linked evidence.')}
          ${renderEntityGroup('Extracted rows', bundle.entries.map(extractedEntryTile), 'No linked extracted rows.')}
          ${renderEntityGroup('Reports', bundle.reports.map(reportTile), 'No linked reports.')}
        </div>
        ${renderEntityGroup('Timeline events', bundle.timeline.map(timelineTile), 'No timeline events yet.', 'story-grid')}
      </div>
    `;
  }

  function buildDutyStoryPage(bundle) {
    const duty = bundle.duty;
    if (!duty) {
      return '<div class="empty-state">Duty not found.</div>';
    }
    const assignmentDay = normaliseDateKey(duty.assignedDate || duty.createdAt);
    const coreLinks = [
      bundle.project && projectTile(bundle.project),
      bundle.beneficiary && beneficiaryTile(bundle.beneficiary),
      bundle.location && locationTile(bundle.location),
      bundle.user ? `
        <div class="entity-link-tile">
          <div class="entity-tile-header">
            <div class="entity-tile-copy">
              <strong>${escapeHtml(bundle.user.fullName)}</strong>
              <small>Assigned user</small>
            </div>
          </div>
          <p>${escapeHtml(`${bundle.user.role || 'staff'} account linked to this duty assignment.`)}</p>
          <div class="entity-tile-meta">
            ${badgeHtml(bundle.user.status || 'active')}
            ${bundle.user.role ? badgeHtml(bundle.user.role, 'muted') : ''}
          </div>
        </div>
      ` : ''
    ].filter(Boolean);
    return `
      <div class="entity-dossier entity-page-shell">
        <div class="dossier-header">
          <div>
            <p class="eyebrow">Duty assignment dossier</p>
            <h3>${escapeHtml(duty.title)}</h3>
            <p>${escapeHtml(duty.notes || 'No duty notes yet.')}</p>
          </div>
          <div class="meta-badges">${badgeHtml(duty.status || 'planned')} ${duty.priority ? badgeHtml(duty.priority) : ''}</div>
        </div>
        ${renderEntitySliderBar('duty', duty.id)}
        ${renderStoryCallout(`${duty.title} keeps accountability visible by linking assignee, project, location, beneficiary context, and nearby timeline events into one operational thread.`)}
        <div class="entity-command-bar">
          <button type="button" class="entity-deep-link" data-open-section="dutiesSection" data-section-title="Duties">Open duty register</button>
          ${bundle.project ? `<button type="button" class="entity-deep-link" data-entity-type="project" data-entity-id="${bundle.project.id}">Project page</button>` : ''}
          ${bundle.beneficiary ? `<button type="button" class="entity-deep-link" data-entity-type="beneficiary" data-entity-id="${bundle.beneficiary.id}">Beneficiary page</button>` : ''}
          ${bundle.location ? `<button type="button" class="entity-deep-link" data-entity-type="location" data-entity-id="${bundle.location.id}">Location page</button>` : ''}
          ${assignmentDay ? `<button type="button" class="entity-deep-link duty-open-calendar-day" data-calendar-day="${assignmentDay}">Assignment day</button>` : ''}
          <button type="button" class="entity-deep-link duty-edit-assignment" data-duty-id="${duty.id}">Edit duty</button>
        </div>
        ${renderCycleIntelligencePanel('duty', bundle)}
        <div>
          ${renderDetailCards([
            { label: 'Duty type', value: humanise(duty.dutyType) },
            { label: 'Assigned user', value: bundle.user ? bundle.user.fullName : duty.assignedUserName || 'Not assigned' },
            { label: 'Assigned beneficiary', value: bundle.beneficiary ? bundle.beneficiary.name : duty.assignedBeneficiaryName || 'Not assigned' },
            { label: 'Project', value: bundle.project ? bundle.project.title : 'Not linked' },
            { label: 'Location', value: bundle.location ? bundle.location.name : 'Not linked' },
            { label: 'Assigned date', value: formatDate(duty.assignedDate || duty.createdAt) },
            { label: 'Due date', value: formatDate(duty.dueDate) },
            { label: 'Status', value: duty.status || 'planned' },
            { label: 'Priority', value: duty.priority || 'normal' },
            { label: 'Tags', value: duty.tags || 'Not recorded' },
            { label: 'Notes', value: duty.notes || 'Not recorded' }
          ])}
        </div>
        <div class="linked-grid">
          ${renderEntityGroup('Linked story pages', coreLinks, 'No linked project, beneficiary, location, or assigned user.', 'story-grid')}
          ${renderEntityGroup('Activities in the same operating thread', bundle.activities.map(activityTile), 'No linked activities yet.')}
          ${renderEntityGroup('Project item rows in the same operating thread', bundle.projectItems.map(projectItemStoryTile), 'No linked project item rows yet.')}
          ${renderEntityGroup('Distributed items in the same operating thread', bundle.distributionEvents.map(calendarDistributionTile), 'No linked distributed item rows yet.')}
          ${renderEntityGroup('Documents and photo evidence', bundle.documents.map(documentTile).concat(bundle.photos.map(photoTile)), 'No linked evidence yet.')}
          ${renderEntityGroup('Maps and spatial evidence', bundle.maps.map(mapTile), 'No linked maps yet.')}
          ${renderEntityGroup('Extracted rows and reports', bundle.entries.map(extractedEntryTile).concat(bundle.reports.map(reportTile)), 'No linked extracted rows or reports yet.')}
          ${renderEntityGroup('Calendar relationship ledger', bundle.calendarEvents.map(calendarEventTile), 'No linked calendar events yet.')}
          ${renderEntityGroup('Related duties', bundle.relatedDuties.map(dutyTile), 'No related duties yet.')}
        </div>
        ${renderEntityGroup('Timeline and history', bundle.timeline.map(timelineTile), 'No timeline context yet.', 'story-grid')}
      </div>
    `;
  }

  function buildProjectItemSubItemTile(parentItem, subItem, index) {
    if (!parentItem || !subItem) {
      return '';
    }
    return entityTileHtml({
      type: 'project_item_subitem',
      id: { itemId: parentItem.id, subItemKey: subItem.key, index },
      title: subItem.name || `Sub-item ${index + 1}`,
      subtitle: parentItem.projectTitle || 'Project item sub-record',
      description: [buildProjectItemSubItemOutcome(subItem, subItem.unitLabel || parentItem.unitLabel), subItem.notes].filter(Boolean).join(' | '),
      badges: [parentItem.categoryName, subItem.status].filter(Boolean)
    });
  }

  function buildProjectItemStoryPage(bundle) {
    const item = bundle.item;
    if (!item) {
      return '<div class="empty-state">Project item not found.</div>';
    }
    const itemCategory = getCategoryById(item.categoryId || bundle.project?.categoryId || 0);
    const distributionDay = normaliseDateKey(item.distributionDate);
    const subItemTotals = bundle.subItems.reduce((totals, subItem) => ({
      distributed: totals.distributed + (Number(subItem.quantityDistributed || 0) || 0),
      survived: totals.survived + (Number(subItem.quantitySurvived || 0) || 0),
      failed: totals.failed + (Number(subItem.quantityFailed || 0) || 0)
    }), { distributed: 0, survived: 0, failed: 0 });
    return `
      <div class="entity-dossier entity-page-shell">
        <div class="dossier-header">
          <div>
            <p class="eyebrow">Project item dossier</p>
            <h3>${escapeHtml([item.itemType, item.itemSubtype].filter(Boolean).join(' - ') || 'Project item')}</h3>
            <p>${escapeHtml(item.notes || 'This item record preserves a parent distribution row and any child species or variant history beneath it.')}</p>
          </div>
          <div class="meta-badges">${item.categoryName ? badgeHtml(item.categoryName) : ''} ${item.status ? badgeHtml(item.status) : ''}</div>
        </div>
        ${renderEntitySliderBar('project_item', item.id)}
        ${renderStoryCallout(`This item page keeps the parent batch, child species/variant breakdown, linked project, linked beneficiary, linked location, and nearby operational history in one recoverable thread.`)}
        <div class="entity-command-bar">
          <button type="button" class="entity-deep-link" data-open-section="projectItemsSection" data-section-title="Project Items">Return to Project Items</button>
          ${bundle.project ? `<button type="button" class="entity-deep-link" data-entity-type="project" data-entity-id="${bundle.project.id}">Project page</button>` : ''}
          ${bundle.beneficiary ? `<button type="button" class="entity-deep-link" data-entity-type="beneficiary" data-entity-id="${bundle.beneficiary.id}">Beneficiary page</button>` : ''}
          ${bundle.location ? `<button type="button" class="entity-deep-link" data-entity-type="location" data-entity-id="${bundle.location.id}">Location page</button>` : ''}
          <button type="button" class="entity-deep-link calendar-edit-item" data-item-id="${item.id}">Edit item</button>
          ${distributionDay ? `<button type="button" class="entity-deep-link duty-open-calendar-day" data-calendar-day="${distributionDay}">Distribution day</button>` : ''}
        </div>
        ${renderCycleIntelligencePanel('project_item', bundle)}
        <div>
          ${renderDetailCards([
            { label: 'Project', value: bundle.project ? bundle.project.title : item.projectTitle || 'Not linked' },
            { label: 'Category', value: item.categoryName || 'Not assigned' },
            { label: 'Beneficiary', value: bundle.beneficiary ? bundle.beneficiary.name : item.beneficiaryName || 'Not linked' },
            { label: 'Location', value: bundle.location ? bundle.location.name : item.locationName || 'Not linked' },
            { label: 'Unit label', value: item.unitLabel || 'Not recorded' },
            { label: 'Distribution date', value: formatDate(item.distributionDate) },
            { label: 'Distributed', value: item.quantityDistributed ?? 'Not recorded' },
            { label: 'Survived/active', value: item.quantitySurvived ?? 'Not recorded' },
            { label: 'Destroyed/failed', value: item.quantityDestroyed ?? 'Not recorded' },
            { label: 'Returned', value: item.quantityReturned ?? 'Not recorded' },
            { label: 'Replaced', value: item.quantityReplaced ?? 'Not recorded' },
            { label: 'Sub-item count', value: bundle.subItems.length ? String(bundle.subItems.length) : 'No child rows' },
            { label: 'Sub-item distributed total', value: bundle.subItems.length ? String(subItemTotals.distributed) : '' },
            { label: 'Sub-item survived total', value: bundle.subItems.length ? String(subItemTotals.survived) : '' },
            { label: 'Sub-item failed total', value: bundle.subItems.length ? String(subItemTotals.failed) : '' },
            { label: 'Notes', value: item.notes || 'Not recorded' }
          ])}
        </div>
        ${bundle.subItems.length ? `
          <div class="linked-card">
            <h4>Sub-items and species history</h4>
            ${renderDetailCards(bundle.subItems.map((subItem, index) => ({
              label: subItem.name || `Sub-item ${index + 1}`,
              value: [buildProjectItemSubItemOutcome(subItem, subItem.unitLabel || item.unitLabel), subItem.notes].filter(Boolean).join(' | ')
            })), 'entry-field-grid')}
          </div>
        ` : ''}
        <div class="linked-grid">
          ${renderEntityGroup('Project category', [projectCategoryTile(itemCategory)].filter(Boolean), 'No linked project category.', 'story-grid')}
          ${renderEntityGroup('Linked story pages', [bundle.project && projectTile(bundle.project), bundle.beneficiary && beneficiaryTile(bundle.beneficiary), bundle.location && locationTile(bundle.location)].filter(Boolean), 'No linked core story pages.', 'story-grid')}
          ${renderEntityGroup('Sub-item full pages', bundle.subItems.map((subItem, index) => buildProjectItemSubItemTile(item, subItem, index)), 'No child sub-items recorded yet.')}
          ${renderEntityGroup('Sibling item rows', bundle.siblingItems.map(projectItemStoryTile), 'No sibling project item rows yet.')}
          ${renderEntityGroup('Maps and spatial evidence', bundle.maps.map(mapTile), 'No linked maps yet.')}
          ${renderEntityGroup('Activities and duties', bundle.activities.map(activityTile).concat(bundle.duties.map(dutyTile)), 'No linked activities or duties yet.')}
          ${renderEntityGroup('Evidence and supporting records', bundle.documents.map(documentTile).concat(bundle.photos.map(photoTile)).concat(bundle.entries.map(extractedEntryTile)).concat(bundle.reports.map(reportTile)), 'No linked supporting records yet.')}
          ${renderEntityGroup('Calendar relationship ledger', bundle.distributionEvents.map(calendarDistributionTile).concat(bundle.calendarEvents.filter((event) => event.eventType !== 'item_distribution').map(calendarEventTile)), 'No linked calendar events yet.')}
        </div>
        ${renderEntityGroup('Timeline and history', bundle.timeline.map(timelineTile), 'No timeline history yet.', 'story-grid')}
      </div>
    `;
  }

  function buildProjectItemSubItemStoryPage(bundle) {
    const parentItem = bundle?.item;
    const subItem = bundle?.subItem;
    if (!parentItem || !subItem) {
      return '<div class="empty-state">Project item sub-item not found.</div>';
    }
    const itemCategory = getCategoryById(parentItem.categoryId || bundle.project?.categoryId || 0);
    return `
      <div class="entity-dossier entity-page-shell">
        <div class="dossier-header">
          <div>
            <p class="eyebrow">Project item sub-item dossier</p>
            <h3>${escapeHtml(subItem.name || 'Sub-item')}</h3>
            <p>${escapeHtml(subItem.notes || 'This sub-item preserves species or variant-level survival history inside the wider parent item record.')}</p>
          </div>
          <div class="meta-badges">${parentItem.categoryName ? badgeHtml(parentItem.categoryName) : ''} ${subItem.status ? badgeHtml(subItem.status) : ''}</div>
        </div>
        ${renderStoryCallout(`${subItem.name || 'This sub-item'} remains linked upward to its parent batch and outward to the same project, beneficiary, location, calendar, and evidence thread.`)}
        <div class="entity-command-bar">
          <button type="button" class="entity-deep-link" data-entity-type="project_item" data-entity-id="${parentItem.id}">Parent item page</button>
          ${bundle.project ? `<button type="button" class="entity-deep-link" data-entity-type="project" data-entity-id="${bundle.project.id}">Project page</button>` : ''}
          ${bundle.beneficiary ? `<button type="button" class="entity-deep-link" data-entity-type="beneficiary" data-entity-id="${bundle.beneficiary.id}">Beneficiary page</button>` : ''}
          ${bundle.location ? `<button type="button" class="entity-deep-link" data-entity-type="location" data-entity-id="${bundle.location.id}">Location page</button>` : ''}
        </div>
        ${renderDetailCards([
          { label: 'Parent item', value: [parentItem.itemType, parentItem.itemSubtype].filter(Boolean).join(' - ') || 'Project item' },
          { label: 'Project', value: bundle.project ? bundle.project.title : parentItem.projectTitle || 'Not linked' },
          { label: 'Beneficiary', value: bundle.beneficiary ? bundle.beneficiary.name : parentItem.beneficiaryName || 'Not linked' },
          { label: 'Location', value: bundle.location ? bundle.location.name : parentItem.locationName || 'Not linked' },
          { label: 'How many', value: subItem.quantityDistributed ?? 'Not recorded' },
          { label: 'Survived', value: subItem.quantitySurvived ?? 'Not recorded' },
          { label: 'Failed', value: subItem.quantityFailed ?? 'Not recorded' },
          { label: 'Unit label', value: subItem.unitLabel || parentItem.unitLabel || 'Not recorded' },
          { label: 'Status/variant', value: subItem.status || 'Not recorded' },
          { label: 'Notes', value: subItem.notes || 'Not recorded' }
        ])}
        <div class="linked-grid">
          ${renderEntityGroup('Project category', [projectCategoryTile(itemCategory)].filter(Boolean), 'No linked project category.', 'story-grid')}
          ${renderEntityGroup('Linked story pages', [entityTileHtml({ type: 'project_item', id: parentItem.id, title: [parentItem.itemType, parentItem.itemSubtype].filter(Boolean).join(' - ') || 'Parent item', subtitle: parentItem.projectTitle || 'Project item', description: buildDistributedItemSummary(parentItem), badges: [parentItem.categoryName].filter(Boolean) }), bundle.project && projectTile(bundle.project), bundle.beneficiary && beneficiaryTile(bundle.beneficiary), bundle.location && locationTile(bundle.location)].filter(Boolean), 'No linked core pages.', 'story-grid')}
          ${renderEntityGroup('Related calendar events', bundle.distributionEvents.map(calendarDistributionTile).concat(bundle.calendarEvents.filter((event) => event.eventType !== 'item_distribution').map(calendarEventTile)), 'No related calendar events yet.')}
          ${renderEntityGroup('Supporting evidence', bundle.documents.map(documentTile).concat(bundle.photos.map(photoTile)).concat(bundle.maps.map(mapTile)), 'No linked supporting evidence yet.')}
        </div>
        ${renderEntityGroup('Timeline and history', bundle.timeline.map(timelineTile), 'No timeline history yet.', 'story-grid')}
      </div>
    `;
  }

  function buildMapStoryPage(bundle) {
    const mapRecord = bundle.map;
    if (!mapRecord) {
      return '<div class="empty-state">Map record not found.</div>';
    }
    const primaryCategory = bundle.categories?.[0] || getCategoryById(bundle.project?.categoryId || bundle.activity?.categoryId || 0);
    return `
      <div class="entity-dossier entity-page-shell">
        <div class="dossier-header">
          <div>
            <p class="eyebrow">Map dossier</p>
            <h3>${escapeHtml(mapRecord.title)}</h3>
            <p>${escapeHtml(mapRecord.notes || 'No map notes recorded yet.')}</p>
          </div>
          <div class="meta-badges">${badgeHtml(mapRecord.provider || 'local')} ${mapRecord.status ? badgeHtml(mapRecord.status) : ''}</div>
        </div>
        ${renderStoryCallout(`${mapRecord.title} keeps spatial evidence, captured imagery, and linked operational records in one recoverable story thread.`)}
        <div class="entity-command-bar">
          <button type="button" class="entity-deep-link" data-open-section="mapsSection" data-section-title="Maps">Return to Maps register</button>
          <button type="button" class="entity-deep-link" data-entity-edit-type="map" data-entity-edit-id="${mapRecord.id}">Edit map</button>
          <button type="button" class="entity-deep-link" data-entity-remove-type="map" data-entity-remove-id="${mapRecord.id}">Remove map</button>
          ${bundle.project ? `<button type="button" class="entity-deep-link" data-entity-type="project" data-entity-id="${bundle.project.id}">Project page</button>` : ''}
          ${bundle.location ? `<button type="button" class="entity-deep-link" data-entity-type="location" data-entity-id="${bundle.location.id}">Location page</button>` : ''}
          ${bundle.activity ? `<button type="button" class="entity-deep-link" data-entity-type="activity" data-entity-id="${bundle.activity.id}">Activity page</button>` : ''}
          ${bundle.duty ? `<button type="button" class="entity-deep-link" data-entity-type="duty" data-entity-id="${bundle.duty.id}">Duty page</button>` : ''}
        </div>
        <div class="entity-media-preview map-dossier-preview map-dossier-preview-wide">
          ${renderMapPreview(mapRecord)}
        </div>
        ${renderDetailCards([
          { label: 'Source type', value: humanise(mapRecord.sourceType || 'reference_only') },
          { label: 'Provider', value: mapRecord.provider || 'local' },
          { label: 'Capture status', value: humanise(mapRecord.captureStatus || 'reference_only') },
          { label: 'Captured date', value: formatDate(mapRecord.capturedAt || mapRecord.createdAt) },
          { label: 'Coordinates', value: mapRecord.latitude && mapRecord.longitude ? `${mapRecord.latitude}, ${mapRecord.longitude}` : 'Not recorded' },
          { label: 'Zoom level', value: mapRecord.zoomLevel || 'Not recorded' },
          { label: 'Marker label', value: mapRecord.markerLabel || 'Not recorded' },
          { label: 'Centre query', value: mapRecord.centreQuery || 'Not recorded' },
          { label: 'Linked image evidence', value: mapRecord.originalFilename || 'No stored image evidence' },
          { label: 'Projects linked', value: bundle.projects?.length || 0 },
          { label: 'Beneficiaries linked', value: bundle.beneficiaries?.length || 0 },
          { label: 'Locations linked', value: bundle.locations?.length || 0 },
          { label: 'Activities linked', value: bundle.activities?.length || 0 },
          { label: 'Duties linked', value: bundle.duties?.length || 0 },
          { label: 'Evidence linked', value: (bundle.documents?.length || 0) + (bundle.photos?.length || 0) },
          { label: 'Tags', value: mapRecord.tags || 'Not recorded' }
        ])}
        <div class="linked-grid">
          ${renderEntityGroup('Project categories', uniqueEntities([primaryCategory].concat(bundle.categories || []).filter(Boolean)).map(projectCategoryTile), 'No linked project category.', 'story-grid')}
          ${renderEntityGroup('Linked projects', (bundle.projects || []).map(projectTile), 'No linked projects.', 'story-grid')}
          ${renderEntityGroup('Linked beneficiaries', (bundle.beneficiaries || []).map(beneficiaryTile), 'No linked beneficiaries.', 'story-grid')}
          ${renderEntityGroup('Linked locations', (bundle.locations || []).map(locationTile), 'No linked locations.', 'story-grid')}
          ${renderEntityGroup('Linked activities', (bundle.activities || []).map(activityTile), 'No linked activities.', 'story-grid')}
          ${renderEntityGroup('Linked duties', (bundle.duties || []).map(dutyTile), 'No linked duties.', 'story-grid')}
          ${renderEntityGroup('Evidence attachments', (bundle.documents || []).map(documentTile).concat((bundle.photos || []).map(photoTile)), 'No linked evidence attachments yet.')}
          ${renderEntityGroup('Linked reports', (bundle.reports || []).map(reportTile), 'No linked reports yet.', 'story-grid')}
          ${renderEntityGroup('Related maps', bundle.relatedMaps.map(mapTile), 'No related maps yet.')}
        </div>
        ${renderEntityGroup('Timeline and history', bundle.timeline.map(timelineTile), 'No timeline context yet.', 'story-grid')}
      </div>
    `;
  }

  function buildDocumentStoryPage(bundle) {
    const documentRecord = bundle.document;
    if (!documentRecord) {
      return '<div class="empty-state">Document not found.</div>';
    }
    const documentCategory = getCategoryById(documentRecord.categoryId || bundle.project?.categoryId || bundle.activity?.categoryId || 0);
    const excelImports = bundle.excelImports || [];
    const excelImportIds = excelImports.map((item) => item.id);
    const excelSheets = getBootstrapArray('excelSheets').filter((item) => excelImportIds.includes(item.excelImportId));
    const excelEntries = bundle.entries.filter((entry) => entry.sourceType === 'excel');
    const nonExcelEntries = bundle.entries.filter((entry) => entry.sourceType !== 'excel');
    const workbookViews = excelImports.length
      ? excelImports.map((excelImport) => ({
        excelImport,
        sheetGroups: buildWorkbookSheetGroups(
          excelSheets.filter((sheet) => sheet.excelImportId === excelImport.id),
          excelEntries.filter((entry) => entry.excelImportId === excelImport.id)
        )
      })).filter((item) => item.sheetGroups.length)
      : [];
    return `
      <div class="entity-dossier entity-page-shell">
        <div class="dossier-header">
          <div>
            <p class="eyebrow">Document dossier</p>
            <h3>${escapeHtml(documentRecord.originalFilename)}</h3>
            <p>${escapeHtml(documentRecord.description || 'No document notes yet.')}</p>
          </div>
            <div class="meta-badges">${badgeHtml(documentRecord.documentStatus)} ${badgeHtml(documentRecord.extractionStatus)}</div>
          </div>
          ${renderEntitySliderBar('document', documentRecord.id)}
          ${renderStoryCallout(`This document remains connected to its original stored file, extracted rows, linked records, and the timeline history around it.`)}
        <div class="entity-command-bar">
          <button type="button" class="entity-deep-link" data-open-file-id="${escapeHtml(documentRecord.id)}">Open stored file</button>
        </div>
        ${renderCycleIntelligencePanel('document', bundle)}
        ${renderDetailCards([
          { label: 'File type', value: documentRecord.fileExtension || 'Not recorded' },
          { label: 'File size', value: formatFileSize(documentRecord.fileSize) },
          { label: 'Uploaded', value: formatDateTime(documentRecord.uploadedAt) },
          { label: 'Category', value: documentRecord.categoryName || 'Not assigned' },
          { label: 'Project', value: bundle.project ? bundle.project.title : 'Not linked' },
          { label: 'Beneficiary', value: bundle.beneficiary ? bundle.beneficiary.name : 'Not linked' },
          { label: 'Location', value: bundle.location ? bundle.location.name : 'Not linked' },
          { label: 'Activity', value: bundle.activity ? bundle.activity.title : 'Not linked' },
          { label: 'Tags', value: documentRecord.tags || 'Not recorded' }
        ])}
        ${workbookViews.map(({ excelImport, sheetGroups }) => renderWorkbookViewer(sheetGroups, {
          title: excelImports.length > 1 ? `${excelImport.originalFilename} workbook view` : 'Workbook view',
          subtitle: `${sheetGroups.length} sheets in spreadsheet layout`
        })).join('')}
        ${nonExcelEntries.length ? `
          <div class="linked-card">
            <h4>Other extracted entries</h4>
            <div class="entry-field-grid">
              ${nonExcelEntries.slice(0, 24).map((entry) => `
                <div class="entry-field-card">
                  <strong>${escapeHtml(getEntryDisplayTitle(entry))}</strong>
                  <span>${escapeHtml(getEntryDisplaySummary(entry))}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
        <div class="linked-grid">
          ${renderEntityGroup('Project category', [projectCategoryTile(documentCategory)].filter(Boolean), 'No linked project category.', 'story-grid')}
          ${renderEntityGroup('Linked story pages', [bundle.project && projectTile(bundle.project), bundle.beneficiary && beneficiaryTile(bundle.beneficiary), bundle.location && locationTile(bundle.location), bundle.activity && activityTile(bundle.activity)].filter(Boolean), 'No linked story records.', 'story-grid')}
          ${renderEntityGroup('Photo evidence generated from this document', bundle.photos.map(photoTile), 'No linked photos.')}
          ${renderEntityGroup('Extracted entries', bundle.entries.slice(0, 16).map(extractedEntryTile), 'No extracted entries.')}
          ${renderEntityGroup('Reports', (bundle.reports || []).map(reportTile), 'No linked reports.')}
        </div>
        ${renderEntityGroup('Timeline and audit trail', bundle.timeline.map(timelineTile), 'No timeline entries yet.', 'story-grid')}
      </div>
    `;
  }

  function buildPhotoStoryPage(bundle) {
    const photo = bundle.photo;
    if (!photo) {
      return '<div class="empty-state">Photo evidence not found.</div>';
    }
    const photoCategory = getCategoryById(bundle.project?.categoryId || bundle.activity?.categoryId || 0);
    const photoDetailCards = renderDetailCards([
      { label: 'Title', value: photo.title || 'Not recorded' },
      { label: 'Description', value: photo.description || 'Not recorded' },
      { label: 'Category', value: humanise(photo.category || 'general_evidence') },
      { label: 'Status', value: humanise(photo.status || 'active') },
      { label: 'Photo date', value: photo.photoDate ? formatDate(photo.photoDate) : 'Not recorded' },
      { label: 'Uploaded', value: formatDateTime(photo.uploadedAt) },
      { label: 'Source document', value: bundle.document ? bundle.document.originalFilename : (photo.originalFilename || 'Not linked') },
      { label: 'Project', value: bundle.project ? bundle.project.title : 'Not linked' },
      { label: 'Beneficiary', value: bundle.beneficiary ? bundle.beneficiary.name : 'Not linked' },
      { label: 'Location', value: bundle.location ? bundle.location.name : 'Not linked' },
      { label: 'Activity', value: bundle.activity ? bundle.activity.title : 'Not linked' },
      { label: 'Tags', value: photo.tags || 'Not recorded' }
    ]);
    return `
      <div class="entity-dossier entity-page-shell">
        <div class="dossier-header">
          <div>
            <p class="eyebrow">Photo evidence dossier</p>
            <h3>${escapeHtml(photo.title)}</h3>
            <p>${escapeHtml(photo.description || 'No photo notes yet.')}</p>
          </div>
            <div class="meta-badges">${badgeHtml(photo.category)} ${photo.photoDate ? badgeHtml(formatDate(photo.photoDate)) : ''}</div>
          </div>
          ${renderEntitySliderBar('photo', photo.id)}
          <div class="entity-media-stack">
            ${photo.storagePath ? `<div class="entity-hero-image entity-hero-image-wide entity-hero-image-contained"><img src="${entityPreviewImage(photo)}" alt="${escapeHtml(photo.title)}"></div>` : ''}
            ${photoDetailCards ? `
              <div class="linked-card">
                <h4>Photo record details</h4>
                ${photoDetailCards}
              </div>
            ` : ''}
            ${renderPhotoDirectLinks(bundle)}
            ${renderStoryCallout(`This evidence item links back to its source document, field location, activity context, and wider operational history. Use the linked pages to move from media proof back to the originating place, people, and project.`)}
            ${renderCycleIntelligencePanel('photo', bundle)}
          </div>
        <div class="linked-grid">
          ${renderEntityGroup('Project category', [projectCategoryTile(photoCategory)].filter(Boolean), 'No linked project category.', 'story-grid')}
          ${renderEntityGroup('Linked story pages', [bundle.document && documentTile(bundle.document), bundle.project && projectTile(bundle.project), bundle.beneficiary && beneficiaryTile(bundle.beneficiary), bundle.location && locationTile(bundle.location), bundle.activity && activityTile(bundle.activity)].filter(Boolean), 'No linked story records.', 'story-grid')}
          ${renderEntityGroup('Related photos', (bundle.relatedPhotos || []).map(photoTile), 'No related photos.', 'story-grid')}
          ${renderEntityGroup('Extracted entries', (bundle.entries || []).slice(0, 16).map(extractedEntryTile), 'No linked extracted entries.')}
          ${renderEntityGroup('Reports', (bundle.reports || []).map(reportTile), 'No linked reports.')}
        </div>
        ${renderEntityGroup('Timeline and usage history', bundle.timeline.map(timelineTile), 'No timeline history yet.', 'story-grid')}
      </div>
    `;
  }

  function buildExcelImportStoryPage(excelImport) {
    if (!excelImport) {
      return '<div class="empty-state">Excel import not found.</div>';
    }
    const relatedEntries = getBootstrapArray('extractedEntries').filter((item) => item.excelImportId === excelImport.id);
    const relatedSheets = getBootstrapArray('excelSheets').filter((item) => item.excelImportId === excelImport.id);
    const linkedProject = excelImport.relatedProjectId ? getProjectById(excelImport.relatedProjectId) : null;
    const linkedBeneficiary = excelImport.beneficiaryId ? getBeneficiaryById(excelImport.beneficiaryId) : null;
    const linkedLocation = excelImport.locationId ? getLocationById(excelImport.locationId) : null;
    const importCategory = getCategoryById(linkedProject?.categoryId || 0);
    const timeline = getBootstrapArray('timelineEntries').filter((item) => item.excelImportId === excelImport.id);
    const reports = getBootstrapArray('reports').filter((item) => item.excelImportId === excelImport.id);
    const sheetGroups = buildWorkbookSheetGroups(relatedSheets, relatedEntries);
    return `
      <div class="entity-dossier entity-page-shell">
        <div class="dossier-header">
          <div>
            <p class="eyebrow">Excel import dossier</p>
            <h3>${escapeHtml(excelImport.originalFilename)}</h3>
            <p>${escapeHtml(excelImport.description || 'Spreadsheet rows are stored independently and remain linked to this import.')}</p>
          </div>
            <div class="meta-badges">${badgeHtml(excelImport.importStatus)} ${badgeHtml(`${excelImport.rowsExtracted || 0} rows`)}</div>
          </div>
          ${renderEntitySliderBar('excel_import', excelImport.id)}
        ${renderCycleIntelligencePanel('excel_import', {
          entries: relatedEntries,
          timeline,
          reports,
          project: linkedProject,
          beneficiary: linkedBeneficiary,
          location: linkedLocation
        })}
        ${renderWorkbookViewer(sheetGroups, {
          title: 'Workbook view',
          subtitle: `${relatedSheets.length} sheets and ${relatedEntries.length} extracted rows`
        })}
        <div class="linked-grid">
          ${renderEntityGroup('Project category', [projectCategoryTile(importCategory)].filter(Boolean), 'No linked project category.', 'story-grid')}
          ${renderEntityGroup('Linked story pages', [linkedProject && projectTile(linkedProject), linkedBeneficiary && beneficiaryTile(linkedBeneficiary), linkedLocation && locationTile(linkedLocation)].filter(Boolean), 'No linked core records.', 'story-grid')}
          ${renderEntityGroup('Document source', getBootstrapArray('documents').filter((item) => item.id === excelImport.documentId).map(documentTile), 'No linked source document.', 'story-grid')}
          ${renderEntityGroup('Sheets and extracted rows', relatedEntries.slice(0, 18).map(extractedEntryTile), 'No extracted rows yet.')}
          ${renderEntityGroup('Reports', reports.map(reportTile), 'No linked reports.')}
        </div>
        ${renderEntityGroup('Timeline and import history', timeline.map(timelineTile), 'No timeline entries yet.', 'story-grid')}
      </div>
    `;
  }

  function buildExtractedEntryStoryPage(bundle) {
    const entry = bundle.entry;
    if (!entry) {
      return '<div class="empty-state">Extracted row not found.</div>';
    }
    const entryCategory = getCategoryById(entry.categoryId || bundle.project?.categoryId || bundle.activity?.categoryId || 0);
    const mappingPairs = Object.entries(entry.mappedFieldsJson || {}).filter(([, value]) => String(value || '').trim() !== '');
    return `
      <div class="entity-dossier entity-page-shell">
        <div class="dossier-header">
          <div>
            <p class="eyebrow">Extracted row dossier</p>
            <h3>${escapeHtml(getEntryDisplayTitle(entry))}</h3>
            <p>${escapeHtml(getEntryDisplaySummary(entry))}</p>
          </div>
            <div class="meta-badges">${badgeHtml(entry.status)} ${badgeHtml(entry.conversionStatus)} ${entry.assignedRecordType ? badgeHtml(entry.assignedRecordType) : ''}</div>
          </div>
          ${renderEntitySliderBar('extracted_entry', entry.id)}
          ${renderStoryCallout(`The raw extracted content remains preserved while cleaned values, mapping notes, review notes, and conversion status continue as separate editorial layers.`)}
        ${renderCycleIntelligencePanel('extracted_entry', {
          project: bundle.project,
          beneficiary: bundle.beneficiary,
          location: bundle.location,
          activity: bundle.activity,
          document: bundle.document,
          timeline: bundle.timeline
        })}
        <div class="detail-grid">
          <div class="detail-card"><strong>Source</strong><span>${escapeHtml([entry.documentName, entry.sourceSheetName && `Sheet ${entry.sourceSheetName}`, entry.sourceRowNumber && `Row ${entry.sourceRowNumber}`].filter(Boolean).join(' | ') || 'Not recorded')}</span></div>
          <div class="detail-card"><strong>Review notes</strong><span>${escapeHtml(entry.reviewNotes || 'No review notes recorded yet.')}</span></div>
          <div class="detail-card"><strong>Assigned record type</strong><span>${escapeHtml(entry.assignedRecordType || 'Not recorded')}</span></div>
          <div class="detail-card"><strong>Category</strong><span>${escapeHtml(entry.categoryName || 'Not recorded')}</span></div>
        </div>
        <div class="linked-card">
          <h4>Readable extracted content</h4>
          ${renderReadableFieldCards(entry, Infinity, 'entry-field-grid')}
        </div>
        ${mappingPairs.length ? `
          <div class="linked-card">
            <h4>Saved mapping notes</h4>
            <div class="entry-field-grid">
              ${mappingPairs.map(([key, value]) => `
                <div class="entry-field-card">
                  <strong>${escapeHtml(humanise(key))}</strong>
                  <span>${escapeHtml(value)}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
        <div class="linked-grid">
          ${renderEntityGroup('Project category', [projectCategoryTile(entryCategory)].filter(Boolean), 'No linked project category.', 'story-grid')}
          ${renderEntityGroup('Linked story pages', [bundle.excelImport && excelImportTile(bundle.excelImport), bundle.project && projectTile(bundle.project), bundle.beneficiary && beneficiaryTile(bundle.beneficiary), bundle.location && locationTile(bundle.location), bundle.activity && activityTile(bundle.activity), bundle.document && documentTile(bundle.document)].filter(Boolean), 'No linked story records.', 'story-grid')}
        </div>
        ${renderEntityGroup('Related timeline context', bundle.timeline.map(timelineTile), 'No related timeline context.', 'story-grid')}
      </div>
    `;
  }

  function buildTimelineStoryPage(bundle) {
    const entry = bundle.timeline;
    if (!entry) {
      return '<div class="empty-state">Timeline event not found.</div>';
    }
    const timelineCategory = getCategoryById(bundle.project?.categoryId || bundle.activity?.categoryId || 0);
    const calendarDay = normaliseDateKey(entry.entryDate);
    return `
      <div class="entity-dossier entity-page-shell">
        <div class="dossier-header">
          <div>
            <p class="eyebrow">Timeline dossier</p>
            <h3>${escapeHtml(entry.title)}</h3>
            <p>${escapeHtml(entry.description || 'No timeline description yet.')}</p>
          </div>
            <div class="meta-badges">${badgeHtml(entry.entryType)} ${badgeHtml(formatDate(entry.entryDate))}</div>
          </div>
          ${renderEntitySliderBar('timeline', entry.id)}
          ${renderStoryCallout(`This event can be followed outward to project, beneficiary, location, activity, document, photo, Excel import, and report pages to reconstruct the full operational story.`)}
        <div class="entity-command-bar">
          ${calendarDay ? `<button type="button" class="entity-deep-link duty-open-calendar-day" data-calendar-day="${calendarDay}">Open calendar day</button>` : ''}
        </div>
        ${renderCycleIntelligencePanel('timeline', bundle)}
        <div class="linked-grid">
          ${renderEntityGroup('Project category', [projectCategoryTile(timelineCategory)].filter(Boolean), 'No linked project category.', 'story-grid')}
          ${renderEntityGroup('Linked story pages', [bundle.project && projectTile(bundle.project), bundle.beneficiary && beneficiaryTile(bundle.beneficiary), bundle.location && locationTile(bundle.location), bundle.activity && activityTile(bundle.activity), bundle.document && documentTile(bundle.document), bundle.photo && photoTile(bundle.photo), bundle.excelImport && excelImportTile(bundle.excelImport), bundle.report && reportTile(bundle.report)].filter(Boolean), 'No linked records.', 'story-grid')}
          ${renderEntityGroup('Related events', bundle.relatedTimeline.map(timelineTile), 'No adjacent timeline events.', 'story-grid')}
        </div>
      </div>
    `;
  }

  function buildReportStoryPage(bundle) {
    const report = bundle.report;
    if (!report) {
      return '<div class="empty-state">Report not found.</div>';
    }
    const reportProjectCategory = getCategoryById(bundle.project?.categoryId || bundle.activity?.categoryId || 0);
    const { bodyHtml } = buildReportContent(report.reportType, {
      project: bundle.project,
      beneficiary: bundle.beneficiary,
      location: bundle.location,
      excelImport: bundle.excelImport,
      activity: bundle.activity
    });
    return `
      <div class="entity-dossier entity-page-shell">
        <div class="dossier-header">
          <div>
            <p class="eyebrow">Report dossier</p>
            <h3>${escapeHtml(report.reportTitle)}</h3>
            <p>${escapeHtml(`Prepared on ${formatDateTime(report.createdAt)} as a ${humanise(report.reportType)} view.`)}</p>
          </div>
            <div class="meta-badges">${badgeHtml(report.reportType)}</div>
          </div>
          ${renderEntitySliderBar('report', report.id)}
          ${renderStoryCallout(`Reports are not isolated printouts here. Each report remains part of the entity graph and can lead back to the project, beneficiary, location, activity, Excel import, and timeline that informed it.`)}
        ${renderCycleIntelligencePanel('report', bundle)}
        ${buildReportSheet(report.reportTitle, bodyHtml, report.createdAt || new Date().toISOString(), state.currentUser?.fullName || report.preparedBy || 'System')}
        <div class="linked-grid">
          ${renderEntityGroup('Project category', [projectCategoryTile(reportProjectCategory)].filter(Boolean), 'No linked project category.', 'story-grid')}
          ${renderEntityGroup('Linked story pages', [bundle.project && projectTile(bundle.project), bundle.beneficiary && beneficiaryTile(bundle.beneficiary), bundle.location && locationTile(bundle.location), bundle.activity && activityTile(bundle.activity), bundle.excelImport && excelImportTile(bundle.excelImport)].filter(Boolean), 'No linked source records.', 'story-grid')}
          ${renderEntityGroup('Timeline context', bundle.timeline.map(timelineTile), 'No timeline context.', 'story-grid')}
        </div>
      </div>
    `;
  }

  function buildGeoStoryPage(bundle) {
    const geo = bundle.geo;
    const parentTrail = buildLocationTrail(geo);
    const childTiles = bundle.children.map((child) => entityTileHtml({
      type: 'geo',
      id: {
        level: child.level,
        name: child.name,
        county: geo.county || '',
        subCounty: child.level === 'ward' || child.level === 'village' ? geo.subCounty || '' : '',
        ward: child.level === 'village' ? geo.ward || '' : '',
        village: child.level === 'village' ? child.name : ''
      },
      title: child.name,
      subtitle: `${humanise(child.level)} page`,
      badges: [child.level]
    }));
    return `
      <div class="entity-dossier entity-page-shell">
        <div class="dossier-header">
          <div>
            <p class="eyebrow">Administrative dossier</p>
            <h3>${escapeHtml(geo.name)}</h3>
            <p>${escapeHtml(`This ${humanise(geo.level)} page gathers every linked project, beneficiary, activity, evidence item, extracted row, and report touching this part of the connected record cycle.`)}</p>
          </div>
            <div class="meta-badges">${badgeHtml(geo.level)}</div>
          </div>
          ${renderEntitySliderBar('geo', geo.id)}
          ${renderStoryCallout(`${geo.name} currently connects ${bundle.projects.length} projects, ${bundle.beneficiaries.length} beneficiaries, ${bundle.activities.length} activities, ${bundle.documents.length} documents, ${bundle.photos.length} photo evidence items, and ${bundle.entries.length} extracted rows.`)}
        ${renderCycleIntelligencePanel('geo', bundle)}
        ${renderEntityGroup('Administrative trail', parentTrail, 'No higher-order administrative trail recorded.', 'story-grid')}
        <div class="linked-grid">
          ${renderEntityGroup('Child administrative pages', childTiles, 'No child administrative pages detected.', 'story-grid')}
          ${renderEntityGroup('Projects', bundle.projects.map(projectTile), 'No linked projects.')}
          ${renderEntityGroup('Beneficiaries', bundle.beneficiaries.map(beneficiaryTile), 'No linked beneficiaries.')}
          ${renderEntityGroup('Activities', bundle.activities.map(activityTile), 'No linked activities.')}
          ${renderEntityGroup('Documents and evidence', bundle.documents.map(documentTile).concat(bundle.photos.map(photoTile)), 'No linked evidence.')}
          ${renderEntityGroup('Extracted rows and reports', bundle.entries.slice(0, 10).map(extractedEntryTile).concat(bundle.reports.map(reportTile)), 'No linked extracted rows or reports.')}
        </div>
        ${renderEntityGroup('Timeline and history', bundle.timeline.slice(0, 12).map(timelineTile), 'No timeline entries yet.', 'story-grid')}
      </div>
    `;
  }

  function renderEntityPage() {
    const target = byId('entityDetailPanel');
    if (!target) {
      return;
    }
    if (!state.currentEntity) {
      target.innerHTML = buildEntityExplorerWelcome();
      bindEntityActions(target);
      return;
    }
    const { type, id } = state.currentEntity;
    let html = '';
    try {
      if (type === 'project') {
        html = buildProjectStoryPage(getLinkedProjectBundle(Number(id)));
      } else if (type === 'project_category') {
        html = buildProjectCategoryStoryPage(getLinkedProjectCategoryBundle(Number(id)));
      } else if (type === 'beneficiary') {
        html = buildBeneficiaryStoryPage(getLinkedBeneficiaryBundle(Number(id)));
      } else if (type === 'location') {
        html = buildLocationStoryPage(getLinkedLocationBundle(Number(id)));
      } else if (type === 'activity') {
        html = buildActivityStoryPage(getLinkedActivityBundle(Number(id)));
      } else if (type === 'duty') {
        html = buildDutyStoryPage(getLinkedDutyBundle(Number(id)));
      } else if (type === 'project_item') {
        html = buildProjectItemStoryPage(getLinkedProjectItemBundle(Number(id)));
      } else if (type === 'project_item_subitem') {
        const parentBundle = getLinkedProjectItemBundle(Number(id?.itemId || 0));
        html = buildProjectItemSubItemStoryPage({
          ...parentBundle,
          subItem: getProjectItemSubItemByRef(id)
        });
      } else if (type === 'document') {
        html = buildDocumentStoryPage(getLinkedDocumentBundle(Number(id)));
      } else if (type === 'photo') {
        html = buildPhotoStoryPage(getLinkedPhotoBundle(Number(id)));
      } else if (type === 'map') {
        html = buildMapStoryPage(getLinkedMapBundle(Number(id)));
      } else if (type === 'excel_import') {
        html = buildExcelImportStoryPage(getExcelImportById(Number(id)));
      } else if (type === 'extracted_entry') {
        html = buildExtractedEntryStoryPage(getLinkedEntryBundle(Number(id)));
      } else if (type === 'timeline') {
        html = buildTimelineStoryPage(getLinkedTimelineBundle(Number(id)));
      } else if (type === 'report') {
        html = buildReportStoryPage(getLinkedReportBundle(Number(id)));
      } else if (type === 'geo') {
        html = buildGeoStoryPage(getGeoBundle(id));
      }
      target.innerHTML = html || '<div class="empty-state">This entity type is not supported yet.</div>';
    } catch (error) {
      target.innerHTML = `<div class="empty-state">Unable to open this full page right now. ${escapeHtml(error?.message || 'Unknown renderer error.')}</div>`;
    }
    enhanceEntityExplorerToc(target);
    bindEntityActions(target);
  }

  function openMapRecord(mapId) {
    state.selectedMapId = Number(mapId) || null;
    switchSection('mapsSection', 'Maps');
    renderMapDetail();
  }

  function renderMapDetail() {
    const target = byId('mapDetailPanel');
    if (!target) {
      return;
    }
    if (!state.selectedMapId) {
      renderEmptyState(target, 'Open a saved map to review its preview, capture method, linked records, and story history.');
      return;
    }
    const mapRecord = getMapById(state.selectedMapId);
    if (!mapRecord) {
      renderEmptyState(target, 'Map record not found.');
      return;
    }
    target.innerHTML = buildMapStoryPage(getLinkedMapBundle(mapRecord.id));
    bindEntityActions(target);
    bindActionButtons(target, {
      '.calendar-edit-item': (event) => {
        const itemId = Number(event.currentTarget.dataset.itemId);
        populateProjectItemForm(getProjectItemById(itemId));
        switchSection('projectItemsSection', 'Project Items');
      }
    });
  }

  function openCalendarDay(dateKey, options = {}) {
    if (!dateKey) {
      return;
    }
    const sourceTrail = Array.isArray(options.breadcrumbTrail) && options.breadcrumbTrail.length
      ? options.breadcrumbTrail
      : (state.breadcrumbs.length ? state.breadcrumbs.slice() : [buildSectionBreadcrumb('calendarSection', getSectionTitle('calendarSection', 'Calendar'))]);
    const breadcrumbTrail = sourceTrail.concat({
      kind: 'calendar_day',
      label: formatDate(dateKey),
      dateKey
    }).slice(-6);
    const monthKey = normaliseMonthKey(dateKey);
    const monthInput = byId('calendarMonthInput');
    if (monthInput) {
      monthInput.value = monthKey;
    }
    const calendarForm = byId('calendarSearchForm');
    state.views.calendar = calendarForm
      ? filterCalendarEventsLocally(Object.fromEntries(new FormData(calendarForm).entries()))
      : deriveCalendarEvents();
    state.selectedCalendarDay = dateKey;
    setTablePage('calendarEventsTable', 1);
    renderCalendar(state.views.calendar || deriveCalendarEvents());
    byId('calendarDayTitle').textContent = `Calendar Day: ${formatDate(dateKey)}`;
    switchSection('calendarDaySection', `Calendar Day: ${formatDate(dateKey)}`, { preserveBreadcrumbs: true, breadcrumbs: breadcrumbTrail });
  }

  function renderDutyAssignmentPage() {
    const target = byId('dutyAssignmentDetailPanel');
    const titleTarget = byId('dutyAssignmentPageTitle');
    const editButton = byId('dutyAssignmentEditButton');
    if (!target || !titleTarget || !editButton) {
      return;
    }
    const dutyId = Number(state.selectedDutyId || state.currentEntity?.id || 0);
    const duty = getDutyById(dutyId);
    titleTarget.textContent = duty ? `Duty Assignment: ${duty.title}` : 'Duty assignment dossier';
    editButton.disabled = !duty;
    if (!duty) {
      renderEmptyState(target, 'Open a duty assignment to see its connected project, beneficiary, location, calendar, evidence, and timeline story.');
      return;
    }
    target.innerHTML = buildDutyStoryPage(getLinkedDutyBundle(dutyId));
    enhanceEntityExplorerToc(target);
    bindEntityActions(target);
    bindActionButtons(target, {
      '.calendar-edit-item': (event) => {
        const itemId = Number(event.currentTarget.dataset.itemId);
        populateProjectItemForm(getProjectItemById(itemId));
        switchSection('projectItemsSection', 'Project Items');
      },
      '.duty-open-calendar-day': (event) => {
        openCalendarDay(event.currentTarget.dataset.calendarDay);
      },
      '.duty-edit-assignment': (event) => {
        const selectedDuty = getDutyById(Number(event.currentTarget.dataset.dutyId));
        populateDutyForm(selectedDuty);
        switchSection('dutiesSection', 'Duties');
      }
    });
  }

  function renderProjects(rows) {
    const target = byId('projectsTable');
    renderTable(target, [
      { label: 'Project', render: (row) => `<strong>${escapeHtml(row.title)}</strong><br><small>${escapeHtml(row.projectCode || '')}</small>` },
      { label: 'Category', render: (row) => row.categoryId ? `<button type="button" class="inline-button project-category-open" data-category-id="${row.categoryId}">${escapeHtml(row.categoryName || 'Category')}</button>` : 'Not assigned' },
      { label: 'Status', render: (row) => badgeHtml(row.status) },
      { label: 'County', render: (row) => escapeHtml(row.county || row.location || 'Not recorded') },
      { label: 'Beneficiaries', render: (row) => escapeHtml((row.beneficiaryIds || []).length) },
      { label: 'Locations', render: (row) => escapeHtml((row.locationIds || []).length) }
    ], rows, (row) => [
      `<button type="button" class="inline-button project-open" data-id="${row.id}">Open</button>`,
      `<button type="button" class="inline-button project-edit" data-id="${row.id}">Edit</button>`,
      `<button type="button" class="inline-button project-mark-status" data-id="${row.id}" data-status="completed">Complete</button>`,
      `<button type="button" class="inline-button project-mark-status" data-id="${row.id}" data-status="failed">Fail</button>`,
      `<button type="button" class="inline-button project-mark-status" data-id="${row.id}" data-status="rescheduled">Reschedule</button>`,
      `<button type="button" class="inline-button project-delete" data-id="${row.id}">Delete</button>`
    ], 'No project records yet.');

    bindActionButtons(target, {
      '.project-category-open': (event) => {
        openEntity('project_category', Number(event.currentTarget.dataset.categoryId));
      },
      '.project-open': (event) => {
        openEntity('project', Number(event.currentTarget.dataset.id));
      },
      '.project-edit': (event) => fillProjectForm(Number(event.currentTarget.dataset.id)),
      '.project-mark-status': async (event) => {
        await quickUpdateProjectStatus(Number(event.currentTarget.dataset.id), event.currentTarget.dataset.status);
      },
      '.project-delete': async (event) => {
        const id = Number(event.currentTarget.dataset.id);
        const project = getProjectById(id);
        if (!window.confirm(`Delete project "${project.title}"?`)) {
          return;
        }
        await performAction(() => window.environmentApp.deleteProject(id), 'Project deleted.');
      }
    });
  }

  function renderProjectDetail() {
    const target = byId('projectDetailPanel');
    if (!target) {
      return;
    }
    if (!state.selectedProjectId) {
      renderEmptyState(target, 'Open a project to see its connected story.');
      return;
    }

    const bundle = getLinkedProjectBundle(state.selectedProjectId);
    const project = bundle.project;
    if (!project) {
      renderEmptyState(target, 'Project not found.');
      return;
    }

    target.innerHTML = `<div class="compact-project-dossier">${buildProjectStoryPage(bundle)}</div>`;
    bindEntityActions(target);
  }

  function fillProjectForm(id) {
    const project = getProjectById(id);
    if (!project) {
      return;
    }
    state.selectedProjectId = id;
    const form = byId('projectForm');
    getFormField(form, 'id').value = project.id || '';
    getFormField(form, 'title').value = project.title || '';
    getFormField(form, 'projectCode').value = project.projectCode || '';
    getFormField(form, 'categoryId').value = project.categoryId || '';
    getFormField(form, 'status').value = project.status || '';
    getFormField(form, 'projectStage').value = project.projectStage || '';
    getFormField(form, 'projectOfficer').value = project.projectOfficer || '';
    getFormField(form, 'county').value = project.county || '';
    getFormField(form, 'subCounty').value = project.subCounty || '';
    getFormField(form, 'ward').value = project.ward || '';
    getFormField(form, 'village').value = project.village || '';
    getFormField(form, 'latitude').value = project.latitude || '';
    getFormField(form, 'longitude').value = project.longitude || '';
    getFormField(form, 'dateStarted').value = project.dateStarted || '';
    getFormField(form, 'dateCompleted').value = project.dateCompleted || '';
    getFormField(form, 'seedlingsIssued').value = project.seedlingsIssued ?? '';
    getFormField(form, 'seedlingsSurvived').value = project.seedlingsSurvived ?? '';
    getFormField(form, 'seedlingsLost').value = project.seedlingsLost ?? '';
    getFormField(form, 'budgetAmount').value = project.budgetAmount || '';
    getFormField(form, 'actualCost').value = project.actualCost || '';
    getFormField(form, 'donorName').value = project.donorName || '';
    getFormField(form, 'verificationStatus').value = project.verificationStatus || '';
    getFormField(form, 'seedlingLossReasons').value = project.seedlingLossReasons || '';
    getFormField(form, 'summary').value = project.summary || '';
    getFormField(form, 'backgroundStory').value = project.backgroundStory || '';
    getFormField(form, 'objective').value = project.objective || '';
    getFormField(form, 'description').value = project.description || '';
    getFormField(form, 'notes').value = project.notes || '';
    getFormField(form, 'tags').value = project.tags || '';
    getFormField(form, 'customData').value = JSON.stringify(project.customData || {}, null, 2);
    setMultipleSelectValues(byId('projectLocationSelect'), project.locationIds || []);
    setMultipleSelectValues(byId('projectBeneficiarySelect'), project.beneficiaryIds || []);
    renderProjectCategoryFields(project.categoryId, project.customData || {});
    renderDistributedItemsPanel('project', project.distributedItems || [{}]);
    renderProjectDetail();
  }

  function renderBeneficiaries(rows) {
    const target = byId('beneficiariesTable');
    renderTable(target, [
      { label: 'Beneficiary', render: (row) => `<strong>${escapeHtml(row.name)}</strong><br><small>${escapeHtml(row.beneficiaryCode || '')}</small>` },
      { label: 'Type', render: (row) => escapeHtml(humanise(row.type)) },
      { label: 'Location', render: (row) => escapeHtml([row.county, row.ward, row.village].filter(Boolean).join(', ') || row.location || 'Not recorded') },
      { label: 'Projects', render: (row) => escapeHtml((row.projectIds || []).length) },
      { label: 'Benefit items', render: (row) => escapeHtml((row.distributedItems || []).length) }
    ], rows, (row) => [
      `<button type="button" class="inline-button beneficiary-open" data-id="${row.id}">Open</button>`,
      `<button type="button" class="inline-button beneficiary-edit" data-id="${row.id}">Edit</button>`,
      `<button type="button" class="inline-button beneficiary-delete" data-id="${row.id}">Delete</button>`
    ], 'No beneficiary records yet.');

    bindActionButtons(target, {
      '.beneficiary-open': (event) => {
        openEntity('beneficiary', Number(event.currentTarget.dataset.id));
      },
      '.beneficiary-edit': (event) => fillBeneficiaryForm(Number(event.currentTarget.dataset.id)),
      '.beneficiary-delete': async (event) => {
        const id = Number(event.currentTarget.dataset.id);
        const beneficiary = getBeneficiaryById(id);
        if (!window.confirm(`Delete beneficiary "${beneficiary.name}"?`)) {
          return;
        }
        await performAction(() => window.environmentApp.deleteBeneficiary(id), 'Beneficiary deleted.');
      }
    });
  }

  function renderBeneficiaryDetail() {
    const target = byId('beneficiaryDetailPanel');
    if (!target) {
      return;
    }
    if (!state.selectedBeneficiaryId) {
      renderEmptyState(target, 'Open a beneficiary to see linked projects, locations, evidence, and timeline.');
      return;
    }
    const bundle = getLinkedBeneficiaryBundle(state.selectedBeneficiaryId);
    const beneficiary = bundle.beneficiary;
    if (!beneficiary) {
      renderEmptyState(target, 'Beneficiary not found.');
      return;
    }
    target.innerHTML = buildBeneficiaryStoryPage(bundle);
    bindEntityActions(target);
  }

  function fillBeneficiaryForm(id) {
    const beneficiary = getBeneficiaryById(id);
    if (!beneficiary) {
      return;
    }
    state.selectedBeneficiaryId = id;
    const form = byId('beneficiaryForm');
    getFormField(form, 'id').value = beneficiary.id || '';
    getFormField(form, 'name').value = beneficiary.name || '';
    getFormField(form, 'type').value = beneficiary.type || '';
    getFormField(form, 'beneficiaryCode').value = beneficiary.beneficiaryCode || '';
    getFormField(form, 'status').value = beneficiary.status || 'active';
    getFormField(form, 'county').value = beneficiary.county || '';
    getFormField(form, 'subCounty').value = beneficiary.subCounty || '';
    getFormField(form, 'ward').value = beneficiary.ward || '';
    getFormField(form, 'village').value = beneficiary.village || '';
    getFormField(form, 'physicalLocation').value = beneficiary.physicalLocation || '';
    getFormField(form, 'latitude').value = beneficiary.latitude || '';
    getFormField(form, 'longitude').value = beneficiary.longitude || '';
    getFormField(form, 'contactPerson').value = beneficiary.contactPerson || '';
    getFormField(form, 'phone').value = beneficiary.phone || '';
    getFormField(form, 'email').value = beneficiary.email || '';
    getFormField(form, 'notes').value = beneficiary.notes || '';
    getFormField(form, 'tags').value = beneficiary.tags || '';
    setFormCustomData('beneficiary', beneficiary.customData || {});
    setMultipleSelectValues(byId('beneficiaryLocationSelect'), beneficiary.locationIds || []);
    setMultipleSelectValues(byId('beneficiaryProjectSelect'), beneficiary.projectIds || []);
    renderDistributedItemsPanel('beneficiary', beneficiary.distributedItems || [{}]);
    injectEntityCustomFields('beneficiary', beneficiary.customData || {});
    renderBeneficiaryDetail();
  }

  function renderLocations(rows) {
    const target = byId('locationsTable');
    renderTable(target, [
      { label: 'Location', render: (row) => `<strong>${escapeHtml(row.name)}</strong>` },
      { label: 'Type', render: (row) => escapeHtml(humanise(row.locationType)) },
      { label: 'County', render: (row) => escapeHtml(row.county || 'Not recorded') },
      { label: 'Projects', render: (row) => escapeHtml((row.projectIds || []).length) },
      { label: 'Beneficiaries', render: (row) => escapeHtml((row.beneficiaryIds || []).length) }
    ], rows, (row) => [
      `<button type="button" class="inline-button location-open" data-id="${row.id}">Open</button>`,
      `<button type="button" class="inline-button location-edit" data-id="${row.id}">Edit</button>`,
      `<button type="button" class="inline-button location-delete" data-id="${row.id}">Delete</button>`
    ], 'No location records yet.');

    bindActionButtons(target, {
      '.location-open': (event) => {
        openEntity('location', Number(event.currentTarget.dataset.id));
      },
      '.location-edit': (event) => fillLocationForm(Number(event.currentTarget.dataset.id)),
      '.location-delete': async (event) => {
        const id = Number(event.currentTarget.dataset.id);
        const location = getLocationById(id);
        if (!window.confirm(`Delete location "${location.name}"?`)) {
          return;
        }
        await performAction(() => window.environmentApp.deleteLocation(id), 'Location deleted.');
      }
    });
  }

  function renderProjectItems(rows) {
    const target = byId('projectItemsTable');
    renderTable(target, [
      { label: 'Item', render: (row) => `<strong>${escapeHtml([row.itemType, row.itemSubtype].filter(Boolean).join(' - ') || 'Project item')}</strong><br><small>${escapeHtml(row.unitLabel || 'No unit label')}</small>` },
      { label: 'Project', render: (row) => escapeHtml(row.projectTitle || 'Not linked') },
      { label: 'Category', render: (row) => escapeHtml(row.categoryName || 'Not assigned') },
      { label: 'Beneficiary', render: (row) => escapeHtml(row.beneficiaryName || 'Not linked') },
      { label: 'Location', render: (row) => escapeHtml(row.locationName || 'Not linked') },
      { label: 'Outcomes', render: (row) => escapeHtml(buildDistributedItemSummary(row)) }
    ], rows, (row) => [
      `<button type="button" class="inline-button project-item-open-page" data-item-id="${row.id}">Open full page</button>`,
      `<button type="button" class="inline-button project-item-open-project" data-project-id="${row.projectId}">Open project</button>`,
      row.relatedBeneficiaryId ? `<button type="button" class="inline-button project-item-open-beneficiary" data-beneficiary-id="${row.relatedBeneficiaryId}">Open beneficiary</button>` : '',
      row.relatedLocationId ? `<button type="button" class="inline-button project-item-open-location" data-location-id="${row.relatedLocationId}">Open location</button>` : '',
      `<button type="button" class="inline-button project-item-edit" data-item-id="${row.id}">Edit</button>`,
      `<button type="button" class="inline-button project-item-delete" data-item-id="${row.id}">Delete</button>`
    ].filter(Boolean), 'No project item rows yet.');

    bindActionButtons(target, {
      '.project-item-open-page': (event) => {
        openEntity('project_item', Number(event.currentTarget.dataset.itemId));
        switchSection('entitySection', 'Entity Explorer');
      },
      '.project-item-open-project': (event) => openEntity('project', Number(event.currentTarget.dataset.projectId)),
      '.project-item-open-beneficiary': (event) => openEntity('beneficiary', Number(event.currentTarget.dataset.beneficiaryId)),
      '.project-item-open-location': (event) => openEntity('location', Number(event.currentTarget.dataset.locationId)),
      '.project-item-edit': (event) => {
        const item = getProjectItemById(Number(event.currentTarget.dataset.itemId));
        if (item) {
          populateProjectItemForm(item);
        }
      },
      '.project-item-delete': async (event) => {
        const item = getProjectItemById(Number(event.currentTarget.dataset.itemId));
        if (!item || !window.confirm(`Delete project item "${item.itemType || 'row'}" from "${item.projectTitle}"?`)) {
          return;
        }
        await performAction(() => deleteProjectItemRecord(item.id), 'Project item removed.');
        populateProjectItemForm();
      }
    });
  }

  function renderLocationDetail() {
    const target = byId('locationDetailPanel');
    if (!target) {
      return;
    }
    if (!state.selectedLocationId) {
      renderEmptyState(target, 'Open a location to see its project story, impact, evidence, and history.');
      return;
    }
    const bundle = getLinkedLocationBundle(state.selectedLocationId);
    const location = bundle.location;
    if (!location) {
      renderEmptyState(target, 'Location not found.');
      return;
    }
    target.innerHTML = buildLocationStoryPage(bundle);
    bindEntityActions(target);
  }

  function fillLocationForm(id) {
    const location = getLocationById(id);
    if (!location) {
      return;
    }
    state.selectedLocationId = id;
    const form = byId('locationForm');
    getFormField(form, 'id').value = location.id || '';
    getFormField(form, 'name').value = location.name || '';
    getFormField(form, 'locationType').value = location.locationType || '';
    getFormField(form, 'county').value = location.county || '';
    getFormField(form, 'subCounty').value = location.subCounty || '';
    getFormField(form, 'ward').value = location.ward || '';
    getFormField(form, 'village').value = location.village || '';
    getFormField(form, 'latitude').value = location.latitude || '';
    getFormField(form, 'longitude').value = location.longitude || '';
    getFormField(form, 'physicalDescription').value = location.physicalDescription || '';
    getFormField(form, 'notes').value = location.notes || '';
    getFormField(form, 'tags').value = location.tags || '';
    setFormCustomData('location', location.customData || {});
    renderDistributedItemsPanel('location', location.distributedItems || [{}]);
    injectEntityCustomFields('location', location.customData || {});
    renderLocationDetail();
  }

  function getEntryRowValues(entry) {
    return (entry.cleanedJson && entry.cleanedJson.rowValues) || {};
  }

  function getEntryDisplayFields(entry, limit = Infinity) {
    const rowValues = getEntryRowValues(entry);
    const displayOrder = Array.isArray(entry?.cleanedJson?.rowDisplayOrder) && entry.cleanedJson.rowDisplayOrder.length
      ? entry.cleanedJson.rowDisplayOrder
      : Object.keys(rowValues);
    return displayOrder
      .map((label) => ({ label, value: rowValues[label] }))
      .filter((field) => String(field.value || '').trim() !== '')
      .slice(0, limit);
  }

  function getEntryDisplayTitle(entry) {
    const cleanedJson = entry.cleanedJson || {};
    const preferredKeys = ['projectTitle', 'title', 'name', 'beneficiaryName', 'institutionName', 'schoolName', 'groupName', 'location', 'village'];
    const preferredValue = preferredKeys
      .map((key) => cleanedJson[key])
      .find((value) => String(value || '').trim() !== '');
    if (preferredValue) {
      return String(preferredValue);
    }
    const firstField = getEntryDisplayFields(entry, 1)[0];
    return firstField ? String(firstField.value) : `Extracted record ${entry.sourceRowNumber || entry.id}`;
  }

  function getEntryDisplaySummary(entry) {
    return entry.cleanedText || entry.rawText || 'This extracted record is ready for review and conversion.';
  }

  function renderReadableFieldCards(entry, limit = Infinity, cssClass = 'entry-field-grid') {
    const fields = getEntryDisplayFields(entry, limit);
    if (!fields.length) {
      return '<div class="empty-inline">No readable extracted fields are available yet.</div>';
    }
    return `
      <div class="${escapeHtml(cssClass)}">
        ${fields.map((field) => `
          <div class="entry-field-card">
            <strong>${escapeHtml(field.label)}</strong>
            <span>${escapeHtml(field.value)}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  function buildEditedEntryCleanedJson(form, entry) {
    const original = entry && entry.cleanedJson ? { ...entry.cleanedJson } : {};
    const rowDisplayOrder = Array.isArray(original.rowDisplayOrder) && original.rowDisplayOrder.length
      ? original.rowDisplayOrder
      : getEntryDisplayFields(entry).map((field) => field.label);
    const nextRowValues = {};

    form.querySelectorAll('[data-cleaned-field-label]').forEach((field) => {
      nextRowValues[field.dataset.cleanedFieldLabel] = field.value;
    });

    const cleanedJson = {
      ...original,
      rowValues: rowDisplayOrder.reduce((result, label) => {
        result[label] = nextRowValues[label] !== undefined ? nextRowValues[label] : (original.rowValues && original.rowValues[label]) || '';
        return result;
      }, {}),
      rowDisplayOrder
    };

    const displayColumns = Array.isArray(entry?.rawJson?.displayColumns) ? entry.rawJson.displayColumns : [];
    displayColumns.forEach((column) => {
      const value = cleanedJson.rowValues[column.label] || '';
      cleanedJson[column.key] = value;
      if (column.canonicalField) {
        cleanedJson[column.canonicalField] = value;
      }
    });

    return cleanedJson;
  }

  function renderExcelSheetSummaryCards(sheet, coverage = null) {
    if (!sheet) {
      return '';
    }
    const previewHeaders = sheet.previewJson && sheet.previewJson[0] ? Object.keys(sheet.previewJson[0].values || {}) : [];
    return `
      <div class="detail-grid">
        <div class="detail-card"><strong>Sheet name</strong><span>${escapeHtml(sheet.sheetName)}</span></div>
        <div class="detail-card"><strong>Header row</strong><span>${escapeHtml(sheet.headerRowNumber || 'Not detected')}</span></div>
        <div class="detail-card"><strong>Total rows</strong><span>${escapeHtml(sheet.totalRows || 0)}</span></div>
        <div class="detail-card"><strong>Total columns</strong><span>${escapeHtml(sheet.totalColumns || 0)}</span></div>
        ${coverage ? `<div class="detail-card"><strong>Profile coverage</strong><span>${escapeHtml(`${coverage.matchedRows} matched / ${coverage.totalRows} total`)}</span></div>` : ''}
        <div class="detail-card full-span"><strong>Detected headings</strong><span>${escapeHtml(previewHeaders.join(', ') || 'No headings detected')}</span></div>
      </div>
    `;
  }

  function renderDetailCards(items, cssClass = 'detail-grid') {
    const cards = (items || []).filter((item) => String(item && item.value || '').trim() !== '');
    if (!cards.length) {
      return '';
    }
    return `
      <div class="${escapeHtml(cssClass)}">
        ${cards.map((item) => `
          <div class="detail-card">
            <strong>${escapeHtml(item.label)}</strong>
            <span>${item.html ? item.value : escapeHtml(item.value)}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  function getProjectCustomFieldCards(project) {
    const customData = project && project.customData ? project.customData : {};
    const profile = project ? getProjectCategoryProfile(project.categoryId) : null;
    const seenKeys = new Set();
    const cards = [];

    if (profile && Array.isArray(profile.fields)) {
      profile.fields.forEach((field) => {
        const value = customData[field.key];
        if (value === undefined || value === null || value === '') {
          return;
        }
        seenKeys.add(field.key);
        cards.push({ label: field.label, value: String(value) });
      });
    }

    Object.entries(customData).forEach(([key, value]) => {
      if (seenKeys.has(key) || value === undefined || value === null || value === '') {
        return;
      }
      if (['rowValues', 'rowDisplayOrder'].includes(key)) {
        return;
      }
      cards.push({ label: humanise(key), value: typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value) });
    });

    return cards;
  }

  function getMetricCards(metrics) {
    return Object.entries(metrics || {})
      .filter(([, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => ({
        label: humanise(key),
        value: typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)
      }));
  }

  function renderExtractedEntriesTableCards(entries, title) {
    if (!entries.length) {
      return '';
    }
    const firstEntry = entries[0];
    const headers = Array.isArray(firstEntry?.cleanedJson?.rowDisplayOrder) && firstEntry.cleanedJson.rowDisplayOrder.length
      ? firstEntry.cleanedJson.rowDisplayOrder
      : Object.keys(getEntryRowValues(firstEntry));
    if (!headers.length) {
      return '';
    }
    return `
      <div class="linked-card">
        <h4>${escapeHtml(title)}</h4>
        <div class="table-shell document-extracted-table">
          <table>
            <thead>
              <tr>
                ${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${entries.map((entry) => {
                const rowValues = getEntryRowValues(entry);
                return `
                  <tr>
                    ${headers.map((header) => `<td>${escapeHtml(rowValues[header] || '—')}</td>`).join('')}
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderExtractedEntriesTableCards(entries, title) {
    if (!entries.length) {
      return '';
    }
    return `
      <div class="linked-card">
        <h4>${escapeHtml(title)}</h4>
        <div class="document-sheet-card-grid">
          ${entries.map((entry) => `
            <article class="document-sheet-entry-card">
              <div class="document-sheet-entry-header">
                <div>
                  <strong>${escapeHtml(getEntryDisplayTitle(entry))}</strong>
                  <span>Row ${escapeHtml(entry.sourceRowNumber || entry.id)}${entry.sourceSheetName ? ` • ${escapeHtml(entry.sourceSheetName)}` : ''}</span>
                </div>
                <button type="button" class="inline-button entity-link-action" data-entity-type="extracted_entry" data-entity-id="${escapeHtml(encodeEntityId('extracted_entry', entry.id))}">Open full page</button>
              </div>
              <p class="document-sheet-entry-summary">${escapeHtml(getEntryDisplaySummary(entry))}</p>
              ${renderReadableFieldCards(entry, 8, 'document-sheet-entry-fields')}
            </article>
          `).join('')}
        </div>
      </div>
    `;
  }

  function getWorkbookSheetHeaders(entries, sheet = null) {
    const previewHeaders = sheet?.previewJson?.[0]?.values ? Object.keys(sheet.previewJson[0].values) : [];
    if (previewHeaders.length) {
      return previewHeaders;
    }

    const firstEntry = entries[0];
    return Array.isArray(firstEntry?.cleanedJson?.rowDisplayOrder) && firstEntry.cleanedJson.rowDisplayOrder.length
      ? firstEntry.cleanedJson.rowDisplayOrder
      : Object.keys(getEntryRowValues(firstEntry));
  }

  function renderExtractedEntriesTableLegacy(entries, title, sheet = null) {
    if (!entries.length) {
      return '';
    }
    const headers = getWorkbookSheetHeaders(entries, sheet);
    if (!headers.length) {
      return '';
    }
    return `
      <div class="linked-card workbook-sheet-card">
        <h4>${escapeHtml(title)}</h4>
        ${sheet ? renderExcelSheetSummaryCards(sheet) : ''}
        <div class="table-shell document-extracted-table workbook-html-table">
          <table>
            <thead>
              <tr>
                <th>Row</th>
                <th>Summary</th>
                ${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('')}
                <th>Open</th>
              </tr>
            </thead>
            <tbody>
              ${entries.map((entry) => {
                const rowValues = getEntryRowValues(entry);
                return `
                  <tr>
                    <td>${escapeHtml(entry.sourceRowNumber || '—')}</td>
                    <td>
                      <strong>${escapeHtml(getEntryDisplayTitle(entry))}</strong>
                      <small>${escapeHtml(getEntryDisplaySummary(entry))}</small>
                    </td>
                    ${headers.map((header) => `<td>${escapeHtml(rowValues[header] || '—')}</td>`).join('')}
                    <td><button type="button" class="inline-button entity-link-action" data-entity-type="extracted_entry" data-entity-id="${escapeHtml(encodeEntityId('extracted_entry', entry.id))}">Open full page</button></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderExtractedEntriesTable(entries, title, sheet = null) {
    const headers = entries.length ? getWorkbookSheetHeaders(entries, sheet) : (sheet?.previewJson?.[0]?.values ? Object.keys(sheet.previewJson[0].values) : []);
    if (!headers.length && !sheet) {
      return '';
    }
    return `
      <div class="linked-card workbook-sheet-card">
        <div class="workbook-sheet-header">
          <div>
            <h4>${escapeHtml(title)}</h4>
            <p>${escapeHtml([
              sheet?.headerRowNumber && `Header row ${sheet.headerRowNumber}`,
              sheet?.totalRows !== undefined && sheet?.totalColumns !== undefined ? `${sheet.totalRows} rows and ${sheet.totalColumns} columns` : '',
              sheet?.sheetStatus ? humanise(sheet.sheetStatus) : ''
            ].filter(Boolean).join(' | ') || 'Worksheet view')}</p>
          </div>
          ${entries.length ? `<span class="workbook-sheet-count">${escapeHtml(entries.length)} extracted rows</span>` : ''}
        </div>
        <div class="table-shell document-extracted-table workbook-html-table">
          <table>
            <thead>
              <tr>
                <th>Row</th>
                ${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${entries.length ? entries.map((entry) => {
                const rowValues = getEntryRowValues(entry);
                return `
                  <tr>
                    <td>${escapeHtml(entry.sourceRowNumber || '-')}</td>
                    ${headers.map((header) => `<td>${escapeHtml(rowValues[header] || '-')}</td>`).join('')}
                  </tr>
                `;
              }).join('') : `
                <tr>
                  <td>${escapeHtml(sheet?.headerRowNumber ? sheet.headerRowNumber + 1 : '-')}</td>
                  <td colspan="${Math.max(1, headers.length)}" class="workbook-empty-cell">No extracted rows were stored for this sheet.</td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function buildWorkbookSheetGroups(sheets, entries) {
    const sheetNames = Array.from(new Set(
      (sheets || []).map((item) => item.sheetName).concat((entries || []).map((entry) => entry.sourceSheetName)).filter(Boolean)
    ));
    return sheetNames.map((sheetName) => ({
      sheetName,
      entries: (entries || []).filter((entry) => entry.sourceSheetName === sheetName),
      sheet: (sheets || []).find((item) => item.sheetName === sheetName) || null
    }));
  }

  function buildWorkbookSheetKey(sheetName, sheet = null) {
    return `${sheet?.excelImportId || 'sheet'}::${sheetName || 'worksheet'}`;
  }

  function renderWorkbookSheetTable(entries, title, sheet = null, options = {}) {
    const headers = entries.length ? getWorkbookSheetHeaders(entries, sheet) : (sheet?.previewJson?.[0]?.values ? Object.keys(sheet.previewJson[0].values) : []);
    if (!headers.length && !sheet) {
      return '';
    }
    const shellClass = options.showContainer === false ? 'workbook-sheet-frame' : 'linked-card workbook-sheet-card';
    const rowCountLabel = entries.length ? `${entries.length} extracted rows` : 'No extracted rows stored';
    return `
      <div class="${shellClass}">
        <div class="workbook-sheet-header">
          <div>
            <h4>${escapeHtml(title)}</h4>
            <p>${escapeHtml([
              sheet?.headerRowNumber && `Header row ${sheet.headerRowNumber}`,
              sheet?.totalRows !== undefined && sheet?.totalColumns !== undefined ? `${sheet.totalRows} rows and ${sheet.totalColumns} columns` : '',
              sheet?.sheetStatus ? humanise(sheet.sheetStatus) : ''
            ].filter(Boolean).join(' | ') || 'Worksheet view')}</p>
          </div>
          <span class="workbook-sheet-count">${escapeHtml(rowCountLabel)}</span>
        </div>
        <div class="table-shell document-extracted-table workbook-html-table">
          <table>
            <thead>
              <tr>
                <th>Row</th>
                ${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${entries.length ? entries.map((entry) => {
                const rowValues = getEntryRowValues(entry);
                return `
                  <tr>
                    <td>${escapeHtml(entry.sourceRowNumber || '-')}</td>
                    ${headers.map((header) => `<td>${escapeHtml(rowValues[header] || '-')}</td>`).join('')}
                  </tr>
                `;
              }).join('') : `
                <tr>
                  <td>${escapeHtml(sheet?.headerRowNumber ? sheet.headerRowNumber + 1 : '-')}</td>
                  <td colspan="${Math.max(1, headers.length)}" class="workbook-empty-cell">No extracted rows were stored for this sheet.</td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderWorkbookViewer(sheetGroups, options = {}) {
    if (!sheetGroups.length) {
      return '';
    }
    const selectedKey = sheetGroups.some((group) => buildWorkbookSheetKey(group.sheetName, group.sheet) === state.selectedWorkbookSheetKey)
      ? state.selectedWorkbookSheetKey
      : buildWorkbookSheetKey(sheetGroups[0].sheetName, sheetGroups[0].sheet);
    const activeGroup = sheetGroups.find((group) => buildWorkbookSheetKey(group.sheetName, group.sheet) === selectedKey) || sheetGroups[0];
    return `
      <div class="linked-card workbook-viewer-card">
        <div class="workbook-viewer-toolbar">
          <div>
            <h4>${escapeHtml(options.title || 'Workbook view')}</h4>
            <p>${escapeHtml(options.subtitle || 'Spreadsheet layout view')}</p>
          </div>
          <span class="workbook-sheet-count">${escapeHtml(sheetGroups.length)} sheets</span>
        </div>
        <div class="sheet-tabs workbook-sheet-tabs">
          ${sheetGroups.map((group) => {
            const key = buildWorkbookSheetKey(group.sheetName, group.sheet);
            return `<button type="button" class="sheet-tab workbook-sheet-tab ${key === selectedKey ? 'active' : ''}" data-workbook-sheet-key="${escapeHtml(key)}">${escapeHtml(group.sheetName)}</button>`;
          }).join('')}
        </div>
        ${renderWorkbookSheetTable(activeGroup.entries, activeGroup.sheetName, activeGroup.sheet, { showContainer: false })}
      </div>
    `;
  }

  function renderExtractedEntriesTable(entries, title, sheet = null) {
    return renderWorkbookSheetTable(entries, title, sheet);
  }

  function renderExcelImports(rows) {
    const target = byId('excelImportsTable');
    renderTable(target, [
      { label: 'Import', render: (row) => `<strong>${escapeHtml(row.originalFilename)}</strong><br><small>Import ID ${row.id}</small>` },
      { label: 'Sheets', render: (row) => escapeHtml(row.sheetCount) },
      { label: 'Rows extracted', render: (row) => escapeHtml(row.rowsExtracted) },
      { label: 'Reviewed', render: (row) => escapeHtml(row.rowsReviewed) },
      { label: 'Converted', render: (row) => escapeHtml(row.rowsConverted) },
      { label: 'Status', render: (row) => badgeHtml(row.importStatus) }
    ], rows, (row) => [
      `<button type="button" class="inline-button excel-open" data-id="${row.id}">Review console</button>`,
      `<button type="button" class="inline-button excel-entity" data-id="${row.id}">Full page</button>`,
      `<button type="button" class="inline-button excel-remove" data-document-id="${row.documentId}" data-name="${escapeHtml(row.originalFilename)}">Remove import</button>`
    ], 'No Excel imports yet.');

    bindActionButtons(target, {
      '.excel-open': (event) => {
        state.selectedExcelImportId = Number(event.currentTarget.dataset.id);
        state.selectedExcelMappingProfileId = null;
        state.selectedExcelProfileMatchOnly = false;
        state.selectedEntryId = null;
        renderExcelConsole();
      },
      '.excel-entity': (event) => {
        openEntity('excel_import', Number(event.currentTarget.dataset.id));
      },
      '.excel-remove': async (event) => {
        const documentId = Number(event.currentTarget.dataset.documentId);
        const label = event.currentTarget.dataset.name || 'this import';
        if (!window.confirm(`Remove imported document "${label}" and its extracted rows?`)) {
          return;
        }
        await performAction(() => window.environmentApp.deleteDocument(documentId), 'Imported document removed.');
      }
    });
  }

  function renderExcelConsole() {
    const target = byId('excelConsolePanel');
    if (!state.selectedExcelImportId) {
      renderEmptyState(target, 'Open an Excel import to review sheet tabs, styled HTML rows, mapping, and conversion actions.');
      return;
    }
    const excelImport = getExcelImportById(state.selectedExcelImportId);
    if (!excelImport) {
      renderEmptyState(target, 'Excel import not found.');
      return;
    }

    const sheets = getBootstrapArray('excelSheets').filter((item) => item.excelImportId === excelImport.id);
    const entries = getBootstrapArray('extractedEntries').filter((item) => item.excelImportId === excelImport.id);
    const selectedSheetName = state.selectedExcelSheetName || sheets[0]?.sheetName || '';
    const selectedSheetRows = selectedSheetName ? entries.filter((item) => item.sourceSheetName === selectedSheetName) : entries;
    const activeProfileId = Number(state.selectedExcelMappingProfileId || 0);
    const filteredContext = getExcelConsoleRowsForProfile(selectedSheetRows, activeProfileId, state.selectedExcelProfileMatchOnly);
    const selectedRows = filteredContext.rows;
    const activeCoverage = filteredContext.preview;
    const selectedEntry = selectedRows.find((item) => item.id === Number(state.selectedEntryId)) || selectedRows[0] || null;
    const activeSheet = sheets.find((sheet) => sheet.sheetName === selectedSheetName) || sheets[0] || null;
    const tableKey = `excelConsoleRows-${excelImport.id}-${selectedSheetName || 'all'}-${activeProfileId || 'no-profile'}-${state.selectedExcelProfileMatchOnly ? 'matching' : 'all'}`;
    const pageSize = 6;
    const totalPages = Math.max(1, Math.ceil(selectedRows.length / pageSize));
    const currentPage = Math.min(state.tablePaging[tableKey] || 1, totalPages);
    setTablePage(tableKey, currentPage);
    const visibleRows = selectedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    state.tableRenderers[tableKey] = () => renderExcelConsole();

    target.innerHTML = `
      <div class="excel-console excel-console-shell">
        <div class="dossier-header">
          <div>
            <p class="eyebrow">Excel review console</p>
            <h3>${escapeHtml(excelImport.originalFilename)}</h3>
            <p>${escapeHtml(excelImport.description || 'Spreadsheet records are extracted into readable entries for review, linking, and conversion.')}</p>
          </div>
          <div class="meta-badges excel-console-actions">
            ${badgeHtml(excelImport.importStatus)}
            ${badgeHtml(`${excelImport.rowsExtracted} rows`)}
            <button type="button" class="primary-button excel-import-page" data-id="${excelImport.id}">Open full page</button>
          </div>
        </div>
        <div class="detail-grid">
          <div class="detail-card"><strong>Import ID</strong><span>${escapeHtml(excelImport.id)}</span></div>
          <div class="detail-card"><strong>File size</strong><span>${escapeHtml(formatFileSize(excelImport.fileSize))}</span></div>
          <div class="detail-card"><strong>Uploaded</strong><span>${escapeHtml(formatDateTime(excelImport.uploadedAt))}</span></div>
          <div class="detail-card"><strong>Warnings</strong><span>${escapeHtml(excelImport.extractionWarning || 'None')}</span></div>
        </div>
        <div class="sheet-tabs">
          ${sheets.map((sheet) => `<button type="button" class="sheet-tab ${sheet.sheetName === selectedSheetName ? 'active' : ''}" data-sheet="${escapeHtml(sheet.sheetName)}">${escapeHtml(sheet.sheetName)}</button>`).join('')}
        </div>
        ${renderExcelSheetSummaryCards(activeSheet, activeCoverage)}
        <div class="linked-card">
          <h4>Readable extracted records</h4>
          ${state.selectedExcelProfileMatchOnly && activeProfileId ? `<p class="distribution-item-summary">Showing only rows in this sheet that match the selected saved mapping profile. Use the same toggle in the review panel to return to all sheet rows.</p>` : ''}
          <div class="excel-entry-list">
            ${visibleRows.length ? visibleRows.map((entry) => `
              <article class="excel-entry-card ${selectedEntry && selectedEntry.id === entry.id ? 'selected-row' : ''}">
                <div class="excel-entry-card-header">
                  <div>
                    <strong>${escapeHtml(getEntryDisplayTitle(entry))}</strong>
                    <span>${escapeHtml([entry.sourceSheetName && `Sheet ${entry.sourceSheetName}`, entry.sourceRowNumber && `Row ${entry.sourceRowNumber}`].filter(Boolean).join(' | ') || 'Extracted record')}</span>
                  </div>
                  <div class="meta-badges">${badgeHtml(entry.status)} ${badgeHtml(entry.conversionStatus)}</div>
                </div>
                <p class="excel-entry-summary">${escapeHtml(getEntryDisplaySummary(entry))}</p>
                ${activeProfileId ? renderEntryProfileMatchSummary(entry, activeProfileId) : ''}
                ${renderReadableFieldCards(entry, 4, 'entry-field-grid excel-readable-grid')}
                <div class="form-actions">
                  <button type="button" class="secondary-button entry-open" data-id="${entry.id}">Review here</button>
                  <button type="button" class="inline-button entry-page" data-id="${entry.id}">Open full page</button>
                </div>
              </article>
            `).join('') : '<div class="empty-state">No extracted records were found for this sheet.</div>'}
          </div>
        </div>
        ${renderPaginationControls(tableKey, currentPage, totalPages, selectedRows.length, pageSize)}
        <div id="excelEntryEditor">
          ${selectedEntry ? renderExcelEntryEditor(selectedEntry) : '<div class="empty-state">No extracted records were found in this import.</div>'}
        </div>
      </div>
    `;

    bindPaginationButtons(target, tableKey, currentPage);
    target.querySelectorAll('.excel-import-page').forEach((button) => {
      button.addEventListener('click', () => {
        openEntity('excel_import', Number(button.dataset.id));
      });
    });
    target.querySelectorAll('.sheet-tab').forEach((button) => {
      button.addEventListener('click', () => {
        state.selectedExcelSheetName = button.dataset.sheet;
        state.selectedExcelProfileMatchOnly = false;
        state.selectedEntryId = null;
        renderExcelConsole();
      });
    });
    target.querySelectorAll('.entry-open').forEach((button) => {
      button.addEventListener('click', () => {
        state.selectedEntryId = Number(button.dataset.id);
        renderExcelConsole();
      });
    });
    target.querySelectorAll('.entry-page').forEach((button) => {
      button.addEventListener('click', () => {
        openEntity('extracted_entry', Number(button.dataset.id));
      });
    });

    const modernEditorForm = target.querySelector('#excelEntryForm');
    if (modernEditorForm) {
      updateExcelMappingProfilePreview(modernEditorForm, selectedSheetRows, selectedSheetName);
      if (modernEditorForm.mappingProfileId) {
        modernEditorForm.mappingProfileId.value = state.selectedExcelMappingProfileId || '';
        modernEditorForm.mappingProfileId.addEventListener('change', () => {
          state.selectedExcelMappingProfileId = modernEditorForm.mappingProfileId.value ? Number(modernEditorForm.mappingProfileId.value) : null;
          state.selectedExcelProfileMatchOnly = false;
          updateExcelMappingProfilePreview(modernEditorForm, selectedSheetRows, selectedSheetName);
        });
      }

      modernEditorForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const entry = getEntryById(Number(getFormField(form, 'id').value));
        const cleanedJson = buildEditedEntryCleanedJson(form, entry);
        const mappedFieldsJson = buildSuggestedEntryMappingNotes(entry, cleanedJson, form);
        const shouldSaveProfile = String(form.mappingProfileSaveRequested.value || '') === 'true';
        form.mappingProfileSaveRequested.value = '';
        await performAction(() => window.environmentApp.saveExtractedEntry({
          id: Number(getFormField(form, 'id').value),
          assignedRecordType: form.assignedRecordType.value,
          status: form.status.value,
          conversionStatus: form.conversionStatus.value,
          projectId: form.projectId.value ? Number(form.projectId.value) : null,
          beneficiaryId: form.beneficiaryId.value ? Number(form.beneficiaryId.value) : null,
          locationId: form.locationId.value ? Number(form.locationId.value) : null,
          categoryId: form.categoryId.value ? Number(form.categoryId.value) : null,
          cleanedText: form.cleanedText.value,
          cleanedJson,
          mappedFieldsJson,
          mappingProfile: shouldSaveProfile ? buildMappingProfilePayload(entry, form, mappedFieldsJson) : null,
          reviewNotes: form.reviewNotes.value,
          tags: form.tags.value
        }), shouldSaveProfile ? 'Excel row review and mapping profile saved.' : 'Excel row review saved.');
      });

      const applyProfileButton = modernEditorForm.querySelector('.apply-mapping-profile');
      if (applyProfileButton) {
        applyProfileButton.addEventListener('click', () => {
          const selectedProfileId = Number(modernEditorForm.mappingProfileId.value || 0);
          if (!selectedProfileId) {
            showNotification('Select a saved mapping profile first.', true);
            return;
          }
          if (!applyMappingProfileToForm(modernEditorForm, selectedProfileId)) {
            showNotification('Selected mapping profile could not be applied.', true);
            return;
          }
          showNotification('Saved mapping profile applied to this review row.', false);
        });
      }

      const toggleMatchingRowsButton = modernEditorForm.querySelector('.toggle-mapping-profile-matches');
      if (toggleMatchingRowsButton) {
        toggleMatchingRowsButton.addEventListener('click', () => {
          const selectedProfileId = Number(modernEditorForm.mappingProfileId.value || 0);
          if (!selectedProfileId) {
            showNotification('Select a saved mapping profile first.', true);
            return;
          }
          state.selectedExcelMappingProfileId = selectedProfileId;
          state.selectedExcelProfileMatchOnly = !state.selectedExcelProfileMatchOnly;
          state.selectedEntryId = null;
          renderExcelConsole();
        });
      }

      const applySheetProfileButton = modernEditorForm.querySelector('.apply-mapping-profile-sheet');
      if (applySheetProfileButton) {
        applySheetProfileButton.addEventListener('click', async () => {
          const selectedProfileId = Number(modernEditorForm.mappingProfileId.value || 0);
          if (!selectedProfileId) {
            showNotification('Select a saved mapping profile first.', true);
            return;
          }
          const sheetRows = selectedSheetName
            ? entries.filter((item) => item.sourceSheetName === selectedSheetName)
            : entries;
          if (!sheetRows.length) {
            showNotification('No extracted rows are available in this sheet.', true);
            return;
          }
          const preview = buildSheetProfilePreview(selectedProfileId, sheetRows);
          const confirmed = window.confirm(`${describeSheetProfilePreview(preview, selectedSheetName)}\n\nApply the selected mapping profile now? Existing row data will stay unchanged; only saved mapping notes will be updated where labels match.`);
          if (!confirmed) {
            return;
          }
          try {
            const updatedCount = await applyMappingProfileToSheetRows(selectedProfileId, sheetRows);
            showNotification(`Saved mapping profile applied to ${updatedCount} row(s) in this sheet.`, false);
            renderExcelConsole();
          } catch (error) {
            showNotification(error.message, true);
          }
        });
      }

      const saveProfileButton = modernEditorForm.querySelector('.save-mapping-profile');
      if (saveProfileButton) {
        saveProfileButton.addEventListener('click', () => {
          if (!String(modernEditorForm.mappingProfileName.value || '').trim()) {
            showNotification('Enter a mapping profile name before saving it.', true);
            return;
          }
          modernEditorForm.mappingProfileSaveRequested.value = 'true';
          modernEditorForm.requestSubmit();
        });
      }

      modernEditorForm.querySelectorAll('.convert-button').forEach((button) => {
        button.addEventListener('click', async () => {
          const form = modernEditorForm;
          const targetType = button.dataset.target;
          const entry = getEntryById(Number(getFormField(form, 'id').value));
          const cleanedJson = buildEditedEntryCleanedJson(form, entry);
          const conversionDefaults = buildConversionDefaults(targetType, entry, cleanedJson, form);
          await performAction(() => window.environmentApp.convertEntryToRecord({
            entryId: Number(getFormField(form, 'id').value),
            targetType,
            ...conversionDefaults,
            recordData: cleanedJson,
            tags: form.tags.value
          }), `Excel row converted to ${humanise(targetType)}.`);
        });
      });
    }
    return;

    target.innerHTML = `
      <div class="excel-console">
        <div class="dossier-header">
          <div>
            <p class="eyebrow">Excel review console</p>
            <h3>${escapeHtml(excelImport.originalFilename)}</h3>
            <p>${escapeHtml(excelImport.description || 'Spreadsheet rows are stored independently and remain linked to the original workbook.')}</p>
          </div>
          <div class="meta-badges">
            ${badgeHtml(excelImport.importStatus)}
            ${badgeHtml(`${excelImport.rowsExtracted} rows`)}
          </div>
        </div>
        <div class="detail-grid">
          <div class="detail-card"><strong>Import ID</strong><span>${escapeHtml(excelImport.id)}</span></div>
          <div class="detail-card"><strong>File size</strong><span>${escapeHtml(formatFileSize(excelImport.fileSize))}</span></div>
          <div class="detail-card"><strong>Uploaded</strong><span>${escapeHtml(formatDateTime(excelImport.uploadedAt))}</span></div>
          <div class="detail-card"><strong>Warnings</strong><span>${escapeHtml(excelImport.extractionWarning || 'None')}</span></div>
        </div>
        <div class="sheet-tabs">
          ${sheets.map((sheet) => `<button type="button" class="sheet-tab ${sheet.sheetName === selectedSheetName ? 'active' : ''}" data-sheet="${escapeHtml(sheet.sheetName)}">${escapeHtml(sheet.sheetName)}</button>`).join('')}
        </div>
        <div class="table-shell excel-grid-table">
          <table>
            <thead>
              <tr>
                <th>Row</th>
                <th>Review</th>
                <th>Conversion</th>
                <th>Linked project</th>
                <th>Linked beneficiary</th>
                <th>Linked location</th>
                ${(sheets.find((sheet) => sheet.sheetName === selectedSheetName)?.previewJson?.[0] ? Object.keys(sheets.find((sheet) => sheet.sheetName === selectedSheetName).previewJson[0].values).map((header) => `<th>${escapeHtml(header)}</th>`).join('') : '')}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${selectedRows.map((entry) => `
                <tr class="${selectedEntry && selectedEntry.id === entry.id ? 'selected-row' : ''}">
                  <td>${escapeHtml(entry.sourceRowNumber || '—')}</td>
                  <td>${badgeHtml(entry.status)}</td>
                  <td>${badgeHtml(entry.conversionStatus)}</td>
                  <td>${escapeHtml(entry.projectTitle || '—')}</td>
                  <td>${escapeHtml(entry.beneficiaryName || '—')}</td>
                  <td>${escapeHtml(entry.locationName || '—')}</td>
                  ${(sheets.find((sheet) => sheet.sheetName === selectedSheetName)?.previewJson?.[0] ? Object.keys(sheets.find((sheet) => sheet.sheetName === selectedSheetName).previewJson[0].values).map((header) => `<td>${escapeHtml(getEntryRowValues(entry)[header] || '—')}</td>`).join('') : '')}
                  <td><button type="button" class="inline-button entry-open" data-id="${entry.id}">Review</button><button type="button" class="inline-button entry-page" data-id="${entry.id}">Full page</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div id="excelEntryEditor">
          ${selectedEntry ? renderExcelEntryEditor(selectedEntry) : '<div class="empty-state">No extracted rows found in this import.</div>'}
        </div>
      </div>
    `;

    target.querySelectorAll('.sheet-tab').forEach((button) => {
      button.addEventListener('click', () => {
        state.selectedExcelSheetName = button.dataset.sheet;
        state.selectedEntryId = null;
        renderExcelConsole();
      });
    });

    target.querySelectorAll('.entry-open').forEach((button) => {
      button.addEventListener('click', () => {
        state.selectedEntryId = Number(button.dataset.id);
        renderExcelConsole();
      });
    });

    target.querySelectorAll('.entry-page').forEach((button) => {
      button.addEventListener('click', () => {
        openEntity('extracted_entry', Number(button.dataset.id));
      });
    });

    const editorForm = target.querySelector('#excelEntryForm');
    if (editorForm) {
      editorForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        await performAction(() => window.environmentApp.saveExtractedEntry({
          id: Number(getFormField(form, 'id').value),
          assignedRecordType: form.assignedRecordType.value,
          status: form.status.value,
          conversionStatus: form.conversionStatus.value,
          projectId: form.projectId.value ? Number(form.projectId.value) : null,
          beneficiaryId: form.beneficiaryId.value ? Number(form.beneficiaryId.value) : null,
          locationId: form.locationId.value ? Number(form.locationId.value) : null,
          categoryId: form.categoryId.value ? Number(form.categoryId.value) : null,
          cleanedText: form.cleanedText.value,
          cleanedJson: parseJsonField(form.cleanedJson.value || '{}', {}),
          mappedFieldsJson: parseJsonField(form.mappedFieldsJson.value || '{}', {}),
          reviewNotes: form.reviewNotes.value,
          tags: form.tags.value
        }), 'Excel row review saved.');
      });

      editorForm.querySelectorAll('.convert-button').forEach((button) => {
        button.addEventListener('click', async () => {
          const form = editorForm;
          const targetType = button.dataset.target;
          const currentEntry = getEntryById(Number(getFormField(form, 'id').value));
          const cleanedJson = parseJsonField(form.cleanedJson.value || '{}', {});
          const conversionDefaults = buildConversionDefaults(targetType, currentEntry, cleanedJson, form);
          await performAction(() => window.environmentApp.convertEntryToRecord({
            entryId: Number(getFormField(form, 'id').value),
            targetType,
            ...conversionDefaults,
            recordData: cleanedJson,
            tags: form.tags.value
          }), `Excel row converted to ${humanise(targetType)}.`);
        });
      });
    }
  }

  function renderExcelEntryEditor(entry) {
    const schemaHints = getEntrySchemaHints(entry);
    const schemaCoverage = getEntrySchemaCoverage(entry);
    const suggestedMappings = getSuggestedEntryMappings(entry);
    const mappingPairs = Object.entries(entry.mappedFieldsJson || {}).filter(([, value]) => String(value || '').trim() !== '');
    const readableFields = getEntryDisplayFields(entry, Infinity);
    return `
      <div class="entry-preview-shell excel-entry-editor-shell">
        <div class="section-heading">
          <h4>Review selected extracted record</h4>
          <button type="button" class="inline-button entry-page" data-id="${entry.id}">Open full page</button>
        </div>
        <div class="entry-row-summary">
          <strong>${escapeHtml(getEntryDisplayTitle(entry))}</strong><br>
          ${escapeHtml(getEntryDisplaySummary(entry))}
        </div>
        <div class="detail-grid">
          <div class="detail-card"><strong>Source sheet</strong><span>${escapeHtml(entry.sourceSheetName || 'Not recorded')}</span></div>
          <div class="detail-card"><strong>Source row</strong><span>${escapeHtml(entry.sourceRowNumber || 'Not recorded')}</span></div>
          <div class="detail-card"><strong>Linked project</strong><span>${escapeHtml(entry.projectTitle || 'Not linked')}</span></div>
          <div class="detail-card"><strong>Linked beneficiary</strong><span>${escapeHtml(entry.beneficiaryName || 'Not linked')}</span></div>
          <div class="detail-card"><strong>Suggested target</strong><span>${escapeHtml(humanise(schemaHints.suggestedTarget))}</span></div>
          <div class="detail-card"><strong>Suggested activity type</strong><span>${escapeHtml(schemaHints.suggestedActivityType ? humanise(schemaHints.suggestedActivityType) : 'Not category-specific')}</span></div>
        </div>
        ${renderEntryIntelligencePanel(entry)}
        ${schemaCoverage.canonical.length ? `
          <div class="linked-card">
            <h4>Category field priorities</h4>
            <div class="intelligence-chip-row">
              ${schemaCoverage.canonical.map((item) => `
                <span class="status-badge ${item.hasValue ? 'schema-hit-badge' : 'schema-missing-badge'}">
                  ${escapeHtml(item.matchedLabel || humanise(item.fieldKey))}
                </span>
              `).join('')}
            </div>
            <p class="distribution-item-summary">
              ${schemaCoverage.missingCanonical.length
                ? `Still weak or missing: ${escapeHtml(schemaCoverage.missingCanonical.map((item) => humanise(item.fieldKey)).join(', '))}.`
                : 'All category-priority fields are represented in this cleaned review view.'}
            </p>
          </div>
        ` : ''}
        ${suggestedMappings.length ? `
          <div class="linked-card">
            <h4>Suggested field mapping</h4>
            <div class="entry-field-grid">
              ${suggestedMappings.map((item) => `
                <div class="entry-field-card">
                  <strong>${escapeHtml(humanise(item.targetField))}</strong>
                  <span>${escapeHtml(item.sourceLabel)}</span>
                  <small>${escapeHtml(item.confidence === 'direct' ? 'Direct import match' : item.confidence === 'high' ? 'High-confidence category match' : 'Review suggested match')}</small>
                </div>
              `).join('')}
            </div>
            <p class="distribution-item-summary">Use the mapping selectors in the readable fields section below to confirm, change, or clear these suggestions before saving the review.</p>
          </div>
        ` : ''}
        <form id="excelEntryForm" class="form-grid compact-grid">
          <input type="hidden" name="id" value="${entry.id}">
          <input type="hidden" name="mappingProfileSaveRequested" value="">
          <label><span>Assigned record type</span><select name="assignedRecordType" id="excelAssignedRecordType"></select></label>
          <label><span>Review status</span><select name="status" id="excelStatusSelect"></select></label>
          <label><span>Conversion status</span><select name="conversionStatus" id="excelConversionStatusSelect"></select></label>
          <label><span>Project</span><select name="projectId" id="excelEntryProjectSelect"></select></label>
          <label><span>Beneficiary</span><select name="beneficiaryId" id="excelEntryBeneficiarySelect"></select></label>
          <label><span>Location</span><select name="locationId" id="excelEntryLocationSelect"></select></label>
          <label><span>Category</span><select name="categoryId" id="excelEntryCategorySelect"></select></label>
          <label class="full-span"><span>Tags</span><input type="text" name="tags" value="${escapeHtml(entry.tags || '')}"></label>
          <label class="full-span"><span>Cleaned summary</span><textarea name="cleanedText" rows="3">${escapeHtml(entry.cleanedText || entry.rawText || '')}</textarea></label>
          <div class="helper-block full-span">The extracted record remains preserved. Review updates below only refine the readable working copy used for linking and conversion.</div>
          <div class="linked-card full-span mapping-profile-card">
            <h4>Reusable mapping profile</h4>
            <div class="entry-field-grid mapping-profile-grid">
              <label class="entry-field-card">
                <span>Apply saved profile</span>
                <select name="mappingProfileId" id="excelMappingProfileSelect">
                  ${renderMappingProfileOptions(entry)}
                </select>
              </label>
              <label class="entry-field-card">
                <span>Save current mapping as</span>
                <input type="text" name="mappingProfileName" value="${escapeHtml(getDefaultMappingProfileName(entry))}" placeholder="Enter mapping profile name">
              </label>
            </div>
            <div class="form-actions">
              <button type="button" class="secondary-button apply-mapping-profile">Apply selected profile</button>
              <button type="button" class="secondary-button toggle-mapping-profile-matches" disabled>Review matching rows only</button>
              <button type="button" class="secondary-button apply-mapping-profile-sheet">Apply selected profile to this sheet</button>
              <button type="button" class="secondary-button save-mapping-profile">Save review and profile</button>
            </div>
            <p class="distribution-item-summary">Profiles are saved locally and can be reused on later Excel rows with the same or similar worksheet headings.</p>
            <p class="distribution-item-summary" id="excelMappingProfileOrigin">Select a saved mapping profile to view its original source sheet and category context.</p>
            <p class="distribution-item-summary" id="excelMappingProfilePreview">Select a saved mapping profile to preview how many rows and field labels it can match in this sheet.</p>
          </div>
          <div class="full-span">
            <div class="section-heading"><h2>Readable extracted fields</h2></div>
            <div class="entry-field-grid excel-editor-field-grid">
              ${readableFields.map((field) => `
                <label class="entry-field-card ${schemaCoverage.matchedLabels.includes(field.label) ? 'schema-priority-field' : ''}">
                  <span>${escapeHtml(field.label)}</span>
                  ${String(field.value || '').length > 90
                    ? `<textarea rows="3" data-cleaned-field-label="${escapeHtml(field.label)}">${escapeHtml(field.value)}</textarea>`
                    : `<input type="text" data-cleaned-field-label="${escapeHtml(field.label)}" value="${escapeHtml(field.value)}">`}
                  <select data-field-mapping-label="${escapeHtml(field.label)}" class="entry-field-mapping-select">
                    ${renderEntryMappingOptions(entry, field.label)}
                  </select>
                </label>
              `).join('')}
            </div>
          </div>
          ${mappingPairs.length ? `
            <div class="full-span">
              <div class="section-heading"><h2>Saved mapping notes</h2></div>
              <div class="entry-field-grid">
                ${mappingPairs.map(([key, value]) => `
                  <div class="entry-field-card">
                    <strong>${escapeHtml(humanise(key))}</strong>
                    <span>${escapeHtml(value)}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
          <label class="full-span"><span>Review notes</span><textarea name="reviewNotes" rows="3">${escapeHtml(entry.reviewNotes || '')}</textarea></label>
          <div class="form-actions full-span">
            <button type="submit" class="primary-button">Save review</button>
            <button type="button" class="secondary-button convert-button" data-target="project">Create project record</button>
            <button type="button" class="secondary-button convert-button" data-target="beneficiary">Create beneficiary record</button>
            <button type="button" class="secondary-button convert-button" data-target="location">Create location record</button>
            <button type="button" class="secondary-button convert-button" data-target="activity">Create activity record</button>
          </div>
        </form>
      </div>
    `;
    return `
      <div class="entry-preview-shell">
        <h4>Row ${escapeHtml(entry.sourceRowNumber || 'Entry')} review</h4>
        <div class="entry-row-summary">${escapeHtml(entry.rawText || 'This extracted row is ready for review, linking, and conversion.')}</div>
        <div class="entry-field-grid">
          ${Object.entries(getEntryRowValues(entry)).slice(0, 12).map(([key, value]) => `
            <div class="entry-field-card">
              <strong>${escapeHtml(key)}</strong>
              <span>${escapeHtml(value)}</span>
            </div>
          `).join('')}
        </div>
        <form id="excelEntryForm" class="form-grid compact-grid">
          <input type="hidden" name="id" value="${entry.id}">
          <label><span>Assigned record type</span><select name="assignedRecordType" id="excelAssignedRecordType"></select></label>
          <label><span>Review status</span><select name="status" id="excelStatusSelect"></select></label>
          <label><span>Conversion status</span><select name="conversionStatus" id="excelConversionStatusSelect"></select></label>
          <label><span>Project</span><select name="projectId" id="excelEntryProjectSelect"></select></label>
          <label><span>Beneficiary</span><select name="beneficiaryId" id="excelEntryBeneficiarySelect"></select></label>
          <label><span>Location</span><select name="locationId" id="excelEntryLocationSelect"></select></label>
          <label><span>Category</span><select name="categoryId" id="excelEntryCategorySelect"></select></label>
          <label class="full-span"><span>Tags</span><input type="text" name="tags" value="${escapeHtml(entry.tags || '')}"></label>
          <label class="full-span"><span>Cleaned text</span><textarea name="cleanedText" rows="3">${escapeHtml(entry.cleanedText || '')}</textarea></label>
          <div class="helper-block full-span">Field mapping notes and cleaned row data are saved separately so the original workbook row stays unchanged.</div>
          <label class="full-span"><span>Field mapping notes (JSON)</span><textarea name="mappedFieldsJson" rows="4">${escapeHtml(JSON.stringify(entry.mappedFieldsJson || {}, null, 2))}</textarea></label>
          <label class="full-span"><span>Cleaned row data (JSON)</span><textarea name="cleanedJson" rows="6">${escapeHtml(JSON.stringify(entry.cleanedJson || {}, null, 2))}</textarea></label>
          <label class="full-span"><span>Review notes</span><textarea name="reviewNotes" rows="3">${escapeHtml(entry.reviewNotes || '')}</textarea></label>
          <div class="form-actions full-span">
            <button type="submit" class="primary-button">Save review</button>
            <button type="button" class="secondary-button convert-button" data-target="project">Create project record</button>
            <button type="button" class="secondary-button convert-button" data-target="beneficiary">Create beneficiary record</button>
            <button type="button" class="secondary-button convert-button" data-target="location">Create location record</button>
            <button type="button" class="secondary-button convert-button" data-target="activity">Create activity record</button>
          </div>
        </form>
      </div>
    `;
  }

  function bindExcelEditorSelects() {
    const form = byId('excelConsolePanel').querySelector('#excelEntryForm');
    if (!form) {
      return;
    }
    fillSelect(form.querySelector('#excelAssignedRecordType'), RECORD_TYPES, 'Select type');
    fillSelect(form.querySelector('#excelStatusSelect'), ENTRY_STATUSES);
    fillSelect(form.querySelector('#excelConversionStatusSelect'), ['not_converted', 'converted', 'rejected'], 'Select conversion');
    fillSelect(form.querySelector('#excelEntryProjectSelect'), getBootstrapArray('projects').map((item) => ({ value: item.id, label: item.title })), 'No linked project');
    fillSelect(form.querySelector('#excelEntryBeneficiarySelect'), getBootstrapArray('beneficiaries').map((item) => ({ value: item.id, label: item.name })), 'No linked beneficiary');
    fillSelect(form.querySelector('#excelEntryLocationSelect'), getBootstrapArray('locations').map((item) => ({ value: item.id, label: item.name })), 'No linked location');
    fillSelect(form.querySelector('#excelEntryCategorySelect'), getBootstrapArray('categories').map((item) => ({ value: item.id, label: item.name })), 'No category');
    const entry = getEntryById(Number(getFormField(form, 'id').value));
    if (entry) {
      form.querySelector('#excelAssignedRecordType').value = entry.assignedRecordType || inferEntryTargetType(entry) || '';
      form.querySelector('#excelStatusSelect').value = entry.status || 'new';
      form.querySelector('#excelConversionStatusSelect').value = entry.conversionStatus || 'not_converted';
      form.querySelector('#excelEntryProjectSelect').value = entry.projectId || '';
      form.querySelector('#excelEntryBeneficiarySelect').value = entry.beneficiaryId || '';
      form.querySelector('#excelEntryLocationSelect').value = entry.locationId || '';
      form.querySelector('#excelEntryCategorySelect').value = entry.categoryId || '';
      const categorySelect = form.querySelector('#excelEntryCategorySelect');
      const assignedSelect = form.querySelector('#excelAssignedRecordType');
      categorySelect.addEventListener('change', () => {
        if (!assignedSelect.value) {
          assignedSelect.value = getPreferredEntryTargetByCategory(categorySelect.value) || inferEntryTargetType(entry) || '';
        }
      });
    }
  }

  function renderDocuments(rows) {
    const target = byId('documentsTable');
    renderTable(target, [
      { label: 'Document', render: (row) => `<strong>${escapeHtml(row.originalFilename)}</strong>` },
      { label: 'Type', render: (row) => escapeHtml(row.fileExtension) },
      { label: 'Project', render: (row) => escapeHtml(row.projectTitle || '—') },
      { label: 'Status', render: (row) => badgeHtml(row.documentStatus) },
      { label: 'Extraction', render: (row) => badgeHtml(row.extractionStatus, row.extractionStatus === 'failed' ? 'danger' : '') }
    ], rows, (row) => [
      `<button type="button" class="inline-button document-open" data-id="${row.id}">Open detail</button>`,
      `<button type="button" class="inline-button document-file" data-id="${row.id}">Open file</button>`,
      `<button type="button" class="inline-button document-delete" data-id="${row.id}" data-name="${escapeHtml(row.originalFilename)}">Remove</button>`
    ], 'No documents stored yet.');
    bindActionButtons(target, {
      '.document-open': (event) => {
        openEntity('document', Number(event.currentTarget.dataset.id));
      },
      '.document-file': async (event) => {
        await performAction(() => window.environmentApp.openStoredFile(Number(event.currentTarget.dataset.id)), 'Stored file opened.');
      },
      '.document-delete': async (event) => {
        const documentId = Number(event.currentTarget.dataset.id);
        const label = event.currentTarget.dataset.name || 'this document';
        if (!window.confirm(`Remove document "${label}" and its dependent imported records?`)) {
          return;
        }
        await performAction(() => window.environmentApp.deleteDocument(documentId), 'Document removed.');
      }
    });
  }

  function renderDocumentDetail() {
    const target = byId('documentDetailPanel');
    if (!target) {
      return;
    }
    if (!state.selectedDocumentId) {
      renderEmptyState(target, 'Open a document to see metadata, linked records, extraction status, and related entries.');
      return;
    }
    const documentRecord = getBootstrapArray('documents').find((item) => item.id === state.selectedDocumentId);
    if (!documentRecord) {
      renderEmptyState(target, 'Document not found.');
      return;
    }
    target.innerHTML = buildDocumentStoryPage(getLinkedDocumentBundle(documentRecord.id));
    bindEntityActions(target);
  }

  function renderPhotos(rows) {
    const target = byId('photosGallery');
    if (!rows.length) {
      renderEmptyState(target, 'No photo evidence records yet.');
      return;
    }
    const tableKey = getTableKey(target);
    const totalPages = Math.max(1, Math.ceil(rows.length / 8));
    const currentPage = Math.min(state.tablePaging[tableKey] || 1, totalPages);
    setTablePage(tableKey, currentPage);
    const visibleRows = rows.slice((currentPage - 1) * 8, currentPage * 8);
    state.tableRenderers[tableKey] = () => renderPhotos(rows);
    target.innerHTML = visibleRows.map((photo) => `
      <div class="photo-card">
        <div class="photo-thumb">
          ${photo.storagePath ? `<img src="file:///${escapeHtml(String(photo.storagePath).replace(/\\/g, '/'))}" alt="${escapeHtml(photo.title)}">` : ''}
        </div>
        <div class="photo-body">
          <strong>${escapeHtml(photo.title)}</strong>
          <span>${escapeHtml(humanise(photo.category || 'general_evidence'))}</span>
          <p>${escapeHtml(photo.description || 'No photo description recorded.')}</p>
          <small>${escapeHtml([photo.projectTitle, photo.beneficiaryName, photo.locationName].filter(Boolean).join(' | ') || 'Unlinked')}</small>
          <div class="photo-card-actions">
            <button type="button" class="entity-deep-link" data-entity-type="photo" data-entity-id="${photo.id}">Open full page</button>
            <button type="button" class="inline-button photo-edit" data-id="${photo.id}">Edit photo</button>
            <button type="button" class="inline-button photo-replace" data-id="${photo.id}">Replace photo</button>
            <button type="button" class="inline-button photo-delete" data-id="${photo.id}">Remove photo</button>
          </div>
        </div>
      </div>
    `).join('') + renderPaginationControls(tableKey, currentPage, totalPages, rows.length, 8);
    bindEntityActions(target);
    target.querySelectorAll('.photo-edit').forEach((button) => {
      button.addEventListener('click', () => {
        const photo = getPhotoById(Number(button.dataset.id));
        if (photo) {
          populatePhotoForm(photo, 'edit');
        }
      });
    });
    target.querySelectorAll('.photo-replace').forEach((button) => {
      button.addEventListener('click', () => {
        const photo = getPhotoById(Number(button.dataset.id));
        if (photo) {
          populatePhotoForm(photo, 'replace');
        }
      });
    });
    target.querySelectorAll('.photo-delete').forEach((button) => {
      button.addEventListener('click', async () => {
        const photoId = Number(button.dataset.id);
        const photo = getPhotoById(photoId);
        if (!photo || !window.confirm(`Remove "${photo.title}" and its linked stored image file?`)) {
          return;
        }
        await performAction(() => window.environmentApp.deletePhoto(photoId), 'Photo removed.');
        if (String(getFormField(byId('photoForm'), 'id').value || '') === String(photoId)) {
          resetPhotoForm();
        }
      });
    });
    target.querySelectorAll('.pagination-button').forEach((button) => {
      button.addEventListener('click', () => {
        setTablePage(tableKey, button.dataset.pageDirection === 'next' ? currentPage + 1 : currentPage - 1);
        state.tableRenderers[tableKey]?.();
      });
    });
  }

  function populateMapForm(mapRecord = null) {
    const form = byId('mapForm');
    if (!form) {
      return;
    }
    getFormField(form, 'id').value = mapRecord?.id || '';
    getFormField(form, 'title').value = mapRecord?.title || '';
    getFormField(form, 'sourceType').value = mapRecord?.sourceType || 'uploaded_image';
    getFormField(form, 'provider').value = mapRecord?.provider || 'local';
    getFormField(form, 'status').value = mapRecord?.status || 'active';
    getFormField(form, 'projectId').value = mapRecord?.projectId || '';
    getFormField(form, 'beneficiaryId').value = mapRecord?.beneficiaryId || '';
    getFormField(form, 'locationId').value = mapRecord?.locationId || '';
    getFormField(form, 'activityId').value = mapRecord?.activityId || '';
    getFormField(form, 'dutyId').value = mapRecord?.dutyId || '';
    getFormField(form, 'latitude').value = mapRecord?.latitude || '';
    getFormField(form, 'longitude').value = mapRecord?.longitude || '';
    getFormField(form, 'zoomLevel').value = mapRecord?.zoomLevel || '';
    getFormField(form, 'markerLabel').value = mapRecord?.markerLabel || '';
    getFormField(form, 'centreQuery').value = mapRecord?.centreQuery || '';
    getFormField(form, 'embedHtml').value = mapRecord?.embedHtml || '';
    getFormField(form, 'googleApiKey').value = '';
    getFormField(form, 'capturedAt').value = mapRecord?.capturedAt ? String(mapRecord.capturedAt).slice(0, 10) : '';
    getFormField(form, 'notes').value = mapRecord?.notes || '';
    getFormField(form, 'tags').value = mapRecord?.tags || '';
    setFormCustomData('map', mapRecord?.customData || {});
    if (getFormField(form, 'filePath')) {
      getFormField(form, 'filePath').value = '';
    }
    byId('mapFormHeading').textContent = mapRecord ? `Edit map: ${mapRecord.title}` : 'Capture or register map evidence';
    byId('mapFormSubmitButton').textContent = mapRecord ? 'Save map changes' : 'Save map';
    applySmartProjectContextToForm(form, {
      projectField: 'projectId',
      beneficiaryField: 'beneficiaryId',
      locationField: 'locationId'
    });
    syncMapFormRequirements();
    injectEntityCustomFields('map', mapRecord?.customData || {});
    renderFormIntelligence('map');
  }

  function resetMapForm() {
    const form = byId('mapForm');
    if (!form) {
      return;
    }
    form.reset();
    getFormField(form, 'id').value = '';
    getFormField(form, 'sourceType').value = 'uploaded_image';
    getFormField(form, 'provider').value = 'local';
    getFormField(form, 'status').value = 'active';
    setFormCustomData('map', {});
    byId('mapFormHeading').textContent = 'Capture or register map evidence';
    byId('mapFormSubmitButton').textContent = 'Save map';
    syncMapFormRequirements();
    injectEntityCustomFields('map', {});
    renderFormIntelligence('map');
  }

  function syncMapFormRequirements() {
    const form = byId('mapForm');
    if (!form) {
      return;
    }
    const isEditing = !!getFormField(form, 'id').value;
    const sourceType = getFormField(form, 'sourceType').value || 'uploaded_image';
    if (getFormField(form, 'filePath')) {
      getFormField(form, 'filePath').required = !isEditing && sourceType === 'uploaded_image';
    }
  }

  function renderMaps(rows) {
    const target = byId('mapsGallery');
    if (!target) {
      return;
    }
    if (!rows.length) {
      renderEmptyState(target, 'No saved maps yet.');
      return;
    }
    const tableKey = getTableKey(target);
    const totalPages = Math.max(1, Math.ceil(rows.length / 6));
    const currentPage = Math.min(state.tablePaging[tableKey] || 1, totalPages);
    setTablePage(tableKey, currentPage);
    const visibleRows = rows.slice((currentPage - 1) * 6, currentPage * 6);
    state.tableRenderers[tableKey] = () => renderMaps(rows);
    target.innerHTML = visibleRows.map((mapRecord) => `
      <div class="photo-card">
        <div class="photo-thumb">
          ${renderMapPreview(mapRecord)}
        </div>
        <div class="photo-body">
          <strong>${escapeHtml(mapRecord.title)}</strong>
          <span>${escapeHtml(humanise(mapRecord.sourceType || 'reference_only'))}</span>
          <p>${escapeHtml(mapRecord.notes || 'No map notes recorded.')}</p>
          <small>${escapeHtml([mapRecord.projectTitle, mapRecord.locationName, mapRecord.activityTitle, mapRecord.dutyTitle].filter(Boolean).join(' | ') || 'Unlinked')}</small>
          <div class="photo-card-actions">
            <button type="button" class="inline-button map-open" data-id="${mapRecord.id}">Open</button>
            <button type="button" class="inline-button map-edit" data-id="${mapRecord.id}">Edit</button>
            <button type="button" class="inline-button map-delete" data-id="${mapRecord.id}">Remove map</button>
          </div>
        </div>
      </div>
    `).join('') + renderPaginationControls(tableKey, currentPage, totalPages, rows.length, 6);
    bindActionButtons(target, {
      '.map-open': (event) => openEntity('map', Number(event.currentTarget.dataset.id)),
      '.map-edit': (event) => {
        const mapRecord = getMapById(Number(event.currentTarget.dataset.id));
        if (mapRecord) {
          populateMapForm(mapRecord);
        }
      },
      '.map-delete': async (event) => {
        const mapId = Number(event.currentTarget.dataset.id);
        const mapRecord = getMapById(mapId);
        if (!mapRecord || !window.confirm(`Remove map "${mapRecord.title}"? The linked image evidence will stay available.`)) {
          return;
        }
        await performAction(() => window.environmentApp.deleteMap(mapId), 'Map record removed.');
        if (state.selectedMapId === mapId) {
          state.selectedMapId = null;
          renderMapDetail();
        }
        if (String(getFormField(byId('mapForm'), 'id').value || '') === String(mapId)) {
          resetMapForm();
        }
      }
    });
    target.querySelectorAll('.pagination-button').forEach((button) => {
      button.addEventListener('click', () => {
        setTablePage(tableKey, button.dataset.pageDirection === 'next' ? currentPage + 1 : currentPage - 1);
        state.tableRenderers[tableKey]?.();
      });
    });
  }

  function renderActivities(rows) {
    const target = byId('activitiesTable');
    renderTable(target, [
      { label: 'Activity', render: (row) => `<strong>${escapeHtml(row.title)}</strong>` },
      { label: 'Type', render: (row) => escapeHtml(humanise(row.activityType)) },
      { label: 'Date', render: (row) => escapeHtml(formatDate(row.activityDate)) },
      { label: 'Status', render: (row) => badgeHtml(row.status || 'planned') },
      { label: 'Project', render: (row) => escapeHtml(row.projectTitle || '—') },
      { label: 'Follow-up', render: (row) => escapeHtml(row.followUpStatus || '—') }
    ], rows, (row) => [
      `<button type="button" class="inline-button activity-open" data-id="${row.id}">Open</button>`,
      `<button type="button" class="inline-button activity-edit" data-id="${row.id}">Edit</button>`,
      `<button type="button" class="inline-button activity-mark-status" data-id="${row.id}" data-status="completed">Complete</button>`,
      `<button type="button" class="inline-button activity-mark-status" data-id="${row.id}" data-status="failed">Fail</button>`,
      `<button type="button" class="inline-button activity-mark-status" data-id="${row.id}" data-status="rescheduled">Reschedule</button>`
    ], 'No activities recorded yet.');
    bindActionButtons(target, {
      '.activity-open': (event) => openEntity('activity', Number(event.currentTarget.dataset.id)),
      '.activity-edit': (event) => populateActivityForm(getActivityById(Number(event.currentTarget.dataset.id))),
      '.activity-mark-status': async (event) => {
        await quickUpdateActivityStatus(Number(event.currentTarget.dataset.id), event.currentTarget.dataset.status);
      }
    });
  }

  function populateActivityForm(activity) {
    if (!activity) {
      return;
    }
    const form = byId('activityForm');
    getFormField(form, 'id').value = activity.id || '';
    getFormField(form, 'title').value = activity.title || '';
    getFormField(form, 'activityType').value = activity.activityType || '';
    getFormField(form, 'activityDate').value = activity.activityDate || '';
    getFormField(form, 'projectId').value = activity.projectId || '';
    getFormField(form, 'beneficiaryId').value = activity.beneficiaryId || '';
    getFormField(form, 'locationId').value = activity.locationId || '';
    getFormField(form, 'categoryId').value = activity.categoryId || '';
    getFormField(form, 'status').value = activity.status || 'planned';
    getFormField(form, 'activityType').dataset.autoAssigned = 'false';
    getFormField(form, 'followUpStatus').value = activity.followUpStatus || '';
    getFormField(form, 'metricsJson').value = JSON.stringify(activity.metricsJson || {}, null, 2);
    getFormField(form, 'notes').value = activity.notes || '';
    getFormField(form, 'tags').value = activity.tags || '';
    setFormCustomData('activity', activity.customData || {});
    injectEntityCustomFields('activity', activity.customData || {});
    renderFormIntelligence('activity');
  }

  function populateDutyForm(duty) {
    const form = byId('dutyForm');
    if (!form) {
      return;
    }
    getFormField(form, 'id').value = duty?.id || '';
    getFormField(form, 'title').value = duty?.title || '';
    getFormField(form, 'dutyType').value = duty?.dutyType || '';
    getFormField(form, 'assignedUserId').value = duty?.assignedUserId || '';
    getFormField(form, 'assignedBeneficiaryId').value = duty?.assignedBeneficiaryId || '';
    getFormField(form, 'projectId').value = duty?.projectId || '';
    getFormField(form, 'locationId').value = duty?.locationId || '';
    getFormField(form, 'assignedDate').value = duty?.assignedDate ? String(duty.assignedDate).slice(0, 10) : '';
    getFormField(form, 'dueDate').value = duty?.dueDate ? String(duty.dueDate).slice(0, 10) : '';
    getFormField(form, 'status').value = duty?.status || 'planned';
    getFormField(form, 'priority').value = duty?.priority || 'normal';
    getFormField(form, 'notes').value = duty?.notes || '';
    getFormField(form, 'tags').value = duty?.tags || '';
    setFormCustomData('duty', duty?.customData || {});
    applySmartProjectContextToForm(form, {
      projectField: 'projectId',
      beneficiaryField: 'assignedBeneficiaryId',
      locationField: 'locationId'
    });
    injectEntityCustomFields('duty', duty?.customData || {});
    renderFormIntelligence('duty');
  }

  function renderDuties(rows) {
    const target = byId('dutiesTable');
    renderTable(target, [
      { label: 'Duty', render: (row) => `<strong>${escapeHtml(row.title)}</strong><br><small>${escapeHtml(humanise(row.dutyType))}</small>` },
      { label: 'Assigned to', render: (row) => escapeHtml(row.assignedUserName || row.assignedBeneficiaryName || 'Not assigned') },
      { label: 'Status', render: (row) => badgeHtml(row.status || 'planned') },
      { label: 'Project', render: (row) => escapeHtml(row.projectTitle || '—') },
      { label: 'Dates', render: (row) => escapeHtml([row.assignedDate ? `Assigned ${formatDate(row.assignedDate)}` : '', row.dueDate ? `Due ${formatDate(row.dueDate)}` : ''].filter(Boolean).join(' | ') || 'Not recorded') }
    ], rows, (row) => [
      `<button type="button" class="inline-button duty-open" data-id="${row.id}">Open</button>`,
      `<button type="button" class="inline-button duty-edit" data-id="${row.id}">Edit</button>`,
      `<button type="button" class="inline-button duty-mark-status" data-id="${row.id}" data-status="completed">Complete</button>`,
      `<button type="button" class="inline-button duty-mark-status" data-id="${row.id}" data-status="failed">Fail</button>`,
      `<button type="button" class="inline-button duty-mark-status" data-id="${row.id}" data-status="rescheduled">Reschedule</button>`,
      `<button type="button" class="inline-button duty-delete" data-id="${row.id}">Delete</button>`
    ], 'No duties recorded yet.');
    bindActionButtons(target, {
      '.duty-open': (event) => openEntity('duty', Number(event.currentTarget.dataset.id)),
      '.duty-edit': (event) => populateDutyForm(getDutyById(Number(event.currentTarget.dataset.id))),
      '.duty-mark-status': async (event) => {
        await quickUpdateDutyStatus(Number(event.currentTarget.dataset.id), event.currentTarget.dataset.status);
      },
      '.duty-delete': async (event) => {
        const dutyId = Number(event.currentTarget.dataset.id);
        const duty = getDutyById(dutyId);
        if (!duty || !window.confirm(`Delete duty "${duty.title}"?`)) {
          return;
        }
        await performAction(() => window.environmentApp.deleteDuty(dutyId), 'Duty deleted.');
        if (String(getFormField(byId('dutyForm'), 'id').value || '') === String(dutyId)) {
          populateDutyForm(null);
        }
      }
    });
  }

  function renderTimeline(rows) {
    renderTimelineItems(byId('timelineList'), rows);
  }

  function buildReportRows(items, columns) {
    return `
      <table>
        <thead>
          <tr>${columns.map((column) => `<th>${escapeHtml(column.label)}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${items.map((item) => `<tr>${columns.map((column) => `<td>${escapeHtml(column.render(item))}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
    `;
  }

  function buildReportSheet(title, bodyHtml, preparedAt, preparedBy) {
    return `
      <div class="report-sheet report-sheet-dossier">
        <div class="report-header">
          <img src="${escapeHtml(assetUrl(getBranding().logoPath) || 'assets/branding/ksie-letterhead.png')}" alt="${escapeHtml(getBranding().organisationTitle)} logo">
          <div>
            <p class="eyebrow">${escapeHtml(getBranding().organisationTitle)}</p>
            <h2>${escapeHtml(title)}</h2>
            <p>Prepared on ${escapeHtml(formatDateTime(preparedAt))} by ${escapeHtml(preparedBy)}</p>
          </div>
        </div>
        ${bodyHtml}
      </div>
    `;
  }

  function buildReportContent(type, context = {}) {
    const project = context.project || null;
    const beneficiary = context.beneficiary || null;
    const location = context.location || null;
    const excelImport = context.excelImport || null;
    const activity = context.activity || null;
    let title = 'Project Documentation & Impact Management Report';
    let bodyHtml = '';

    if (type === 'all_projects') {
      title = 'All Projects Report';
      bodyHtml = buildReportRows(getBootstrapArray('projects'), [
        { label: 'Project', render: (item) => item.title },
        { label: 'Category', render: (item) => item.categoryName || 'Not assigned' },
        { label: 'Status', render: (item) => humanise(item.status) },
        { label: 'County', render: (item) => item.county || item.location || '' },
        { label: 'Beneficiaries', render: (item) => (item.beneficiaryIds || []).length },
        { label: 'Locations', render: (item) => (item.locationIds || []).length }
      ]);
    } else if (type === 'single_project' && project) {
      const bundle = getLinkedProjectBundle(project.id);
      title = `Single Project Report: ${project.title}`;
      bodyHtml = `
        <div class="report-summary-grid">
          <div><strong>Category</strong><span>${escapeHtml(project.categoryName || 'Not assigned')}</span></div>
          <div><strong>Status</strong><span>${escapeHtml(humanise(project.status))}</span></div>
          <div><strong>Location</strong><span>${escapeHtml([project.county, project.ward, project.village].filter(Boolean).join(', ') || project.location || 'Not recorded')}</span></div>
          <div><strong>Officer</strong><span>${escapeHtml(project.projectOfficer || 'Not recorded')}</span></div>
          <div><strong>Seedling outcomes</strong><span>${escapeHtml(buildProjectSeedlingSummary(project))}</span></div>
          <div><strong>Timeline events</strong><span>${escapeHtml(bundle.timeline.length)}</span></div>
        </div>
        <p>${escapeHtml(project.backgroundStory || project.summary || project.description || 'No project story recorded.')}</p>
        <h3>Projects category page</h3>
        ${buildReportRows([project], [{ label: 'Category', render: () => project.categoryName || 'Not assigned' }, { label: 'Project stage', render: () => project.projectStage || '' }, { label: 'Verification', render: () => project.verificationStatus || '' }])}
        <h3>Location hierarchy</h3>
        ${buildReportRows(bundle.locations, [{ label: 'Location', render: (item) => item.name }, { label: 'Type', render: (item) => humanise(item.locationType) }, { label: 'Area', render: (item) => [item.county, item.subCounty, item.ward, item.village].filter(Boolean).join(', ') }])}
        <h3>Beneficiaries</h3>
        ${buildReportRows(bundle.beneficiaries, [{ label: 'Name', render: (item) => item.name }, { label: 'Type', render: (item) => humanise(item.type) }, { label: 'Location', render: (item) => item.village || item.location || '' }])}
        <h3>Activities</h3>
        ${buildReportRows(bundle.activities, [{ label: 'Activity', render: (item) => item.title }, { label: 'Type', render: (item) => humanise(item.activityType) }, { label: 'Date', render: (item) => formatDate(item.activityDate) }])}
        <h3>Project item rows</h3>
        ${buildReportRows(bundle.projectItems, [{ label: 'Item', render: (item) => [item.itemType, item.itemSubtype].filter(Boolean).join(' - ') || 'Project item' }, { label: 'Beneficiary', render: (item) => item.beneficiaryName || '' }, { label: 'Location', render: (item) => item.locationName || '' }, { label: 'Outcome', render: (item) => buildDistributedItemSummary(item) }])}
        <h3>Duties and assignments</h3>
        ${buildReportRows(bundle.duties, [{ label: 'Duty', render: (item) => item.title }, { label: 'Assignee', render: (item) => item.assignedUserName || item.assignedBeneficiaryName || '' }, { label: 'Status', render: (item) => humanise(item.status || 'planned') }])}
        <h3>Maps and spatial evidence</h3>
        ${buildReportRows(bundle.maps, [{ label: 'Map', render: (item) => item.title }, { label: 'Source', render: (item) => humanise(item.sourceType || 'reference_only') }, { label: 'Location', render: (item) => item.locationName || '' }, { label: 'Status', render: (item) => humanise(item.status || 'active') }])}
        <h3>Documents, imports, and photo evidence</h3>
        ${buildReportRows(bundle.documents.concat(bundle.excelImports).concat(bundle.photos), [{ label: 'Record', render: (item) => item.originalFilename || item.title || '' }, { label: 'Type', render: (item) => item.fileExtension || humanise(item.category || item.importStatus || 'photo_evidence') }, { label: 'Context', render: (item) => item.description || item.projectTitle || item.locationName || '' }])}
        <h3>Linked extracted rows</h3>
        ${buildReportRows(bundle.entries, [{ label: 'Sheet', render: (item) => item.sourceSheetName || '' }, { label: 'Row', render: (item) => item.sourceRowNumber || '' }, { label: 'Summary', render: (item) => item.cleanedText || item.rawText || '' }])}
        <h3>Reports</h3>
        ${buildReportRows(bundle.reports, [{ label: 'Report', render: (item) => item.reportTitle }, { label: 'Type', render: (item) => humanise(item.reportType) }, { label: 'Created', render: (item) => formatDateTime(item.createdAt) }])}
        <h3>Timeline</h3>
        <div>${bundle.timeline.map((item) => `<div class="report-timeline-item"><strong>${escapeHtml(formatDate(item.entryDate))}</strong> ${escapeHtml(item.title)}</div>`).join('') || 'No timeline entries yet.'}</div>
      `;
    } else if (type === 'all_beneficiaries') {
      title = 'All Beneficiaries Report';
      bodyHtml = buildReportRows(getBootstrapArray('beneficiaries'), [
        { label: 'Beneficiary', render: (item) => item.name },
        { label: 'Type', render: (item) => humanise(item.type) },
        { label: 'Location', render: (item) => item.village || item.location || '' },
        { label: 'Projects', render: (item) => (item.projectIds || []).length }
      ]);
    } else if (type === 'single_beneficiary' && beneficiary) {
      const bundle = getLinkedBeneficiaryBundle(beneficiary.id);
      title = `Single Beneficiary Report: ${beneficiary.name}`;
      bodyHtml = `
        <div class="report-summary-grid">
          <div><strong>Type</strong><span>${escapeHtml(humanise(beneficiary.type))}</span></div>
          <div><strong>Location</strong><span>${escapeHtml([beneficiary.county, beneficiary.ward, beneficiary.village].filter(Boolean).join(', ') || beneficiary.location || 'Not recorded')}</span></div>
          <div><strong>Contact</strong><span>${escapeHtml(beneficiary.phone || beneficiary.email || 'Not recorded')}</span></div>
          <div><strong>Status</strong><span>${escapeHtml(humanise(beneficiary.status || 'active'))}</span></div>
        </div>
        <p>${escapeHtml(beneficiary.notes || 'No profile notes recorded.')}</p>
        <h3>Location hierarchy</h3>
        ${buildReportRows(bundle.locations, [{ label: 'Location', render: (item) => item.name }, { label: 'Type', render: (item) => humanise(item.locationType) }, { label: 'Area', render: (item) => [item.county, item.subCounty, item.ward, item.village].filter(Boolean).join(', ') }])}
        <h3>Linked projects</h3>
        ${buildReportRows(bundle.projects, [{ label: 'Project', render: (item) => item.title }, { label: 'Category', render: (item) => item.categoryName || '' }, { label: 'Status', render: (item) => humanise(item.status) }])}
        <h3>Activities, items, maps, and evidence</h3>
        ${buildReportRows(bundle.activities.concat(bundle.projectItems).concat(bundle.maps).concat(bundle.documents).concat(bundle.photos), [{ label: 'Record', render: (item) => item.title || item.originalFilename || [item.itemType, item.itemSubtype].filter(Boolean).join(' - ') || '' }, { label: 'Type', render: (item) => humanise(item.activityType || item.sourceType || item.category || item.fileExtension || 'record') }, { label: 'Context', render: (item) => item.description || item.notes || item.projectTitle || item.locationName || '' }])}
        <h3>Duties</h3>
        ${buildReportRows(bundle.duties, [{ label: 'Duty', render: (item) => item.title }, { label: 'Status', render: (item) => humanise(item.status || 'planned') }, { label: 'Due', render: (item) => formatDate(item.dueDate) }])}
        <h3>Reports</h3>
        ${buildReportRows(bundle.reports, [{ label: 'Report', render: (item) => item.reportTitle }, { label: 'Type', render: (item) => humanise(item.reportType) }, { label: 'Created', render: (item) => formatDateTime(item.createdAt) }])}
        <h3>Timeline</h3>
        <div>${bundle.timeline.map((item) => `<div class="report-timeline-item"><strong>${escapeHtml(formatDate(item.entryDate))}</strong> ${escapeHtml(item.title)}</div>`).join('') || 'No timeline entries yet.'}</div>
      `;
    } else if (type === 'all_locations') {
      title = 'All Locations Report';
      bodyHtml = buildReportRows(getBootstrapArray('locations'), [
        { label: 'Location', render: (item) => item.name },
        { label: 'Type', render: (item) => humanise(item.locationType) },
        { label: 'County', render: (item) => item.county || '' },
        { label: 'Projects', render: (item) => (item.projectIds || []).length }
      ]);
    } else if (type === 'single_location' && location) {
      const bundle = getLinkedLocationBundle(location.id);
      title = `Single Location Report: ${location.name}`;
      bodyHtml = `
        <div class="report-summary-grid">
          <div><strong>Type</strong><span>${escapeHtml(humanise(location.locationType))}</span></div>
          <div><strong>Area</strong><span>${escapeHtml([location.county, location.subCounty, location.ward, location.village].filter(Boolean).join(', ') || 'Not recorded')}</span></div>
          <div><strong>Coordinates</strong><span>${escapeHtml(location.latitude && location.longitude ? `${location.latitude}, ${location.longitude}` : 'Not recorded')}</span></div>
          <div><strong>Projects</strong><span>${escapeHtml(bundle.projects.length)}</span></div>
        </div>
        <h3>Projects in this location</h3>
        ${buildReportRows(bundle.projects, [{ label: 'Project', render: (item) => item.title }, { label: 'Status', render: (item) => humanise(item.status) }, { label: 'Category', render: (item) => item.categoryName || '' }])}
        <h3>Beneficiaries and activities</h3>
        ${buildReportRows(bundle.beneficiaries.concat(bundle.activities), [{ label: 'Record', render: (item) => item.name || item.title || '' }, { label: 'Type', render: (item) => humanise(item.type || item.activityType || item.locationType || 'record') }, { label: 'Context', render: (item) => item.notes || item.followUpStatus || item.physicalDescription || '' }])}
        <h3>Project item rows and maps</h3>
        ${buildReportRows(bundle.projectItems.concat(bundle.maps), [{ label: 'Record', render: (item) => item.title || [item.itemType, item.itemSubtype].filter(Boolean).join(' - ') || 'Project item' }, { label: 'Type', render: (item) => humanise(item.sourceType || item.category || 'project_item') }, { label: 'Context', render: (item) => item.projectTitle || item.notes || buildDistributedItemSummary(item) || '' }])}
        <h3>Duties</h3>
        ${buildReportRows(bundle.duties, [{ label: 'Duty', render: (item) => item.title }, { label: 'Assignee', render: (item) => item.assignedUserName || item.assignedBeneficiaryName || '' }, { label: 'Status', render: (item) => humanise(item.status || 'planned') }])}
        <h3>Evidence, reports, and timeline</h3>
        ${buildReportRows(bundle.documents.concat(bundle.photos).concat(bundle.reports), [{ label: 'Evidence', render: (item) => item.originalFilename || item.title || item.reportTitle || '' }, { label: 'Type', render: (item) => item.fileExtension || humanise(item.category || item.reportType || 'photo_evidence') }, { label: 'Context', render: (item) => item.description || item.reportTitle || '' }])}
        <div>${bundle.timeline.map((item) => `<div class="report-timeline-item"><strong>${escapeHtml(formatDate(item.entryDate))}</strong> ${escapeHtml(item.title)}</div>`).join('') || 'No timeline entries yet.'}</div>
      `;
    } else if (type === 'excel_import' && excelImport) {
      const rows = getBootstrapArray('extractedEntries').filter((item) => item.excelImportId === excelImport.id);
      title = `Excel Import Report: ${excelImport.originalFilename}`;
      bodyHtml = `
        <div class="report-summary-grid">
          <div><strong>Import ID</strong><span>${escapeHtml(excelImport.id)}</span></div>
          <div><strong>Sheets</strong><span>${escapeHtml(excelImport.sheetCount)}</span></div>
          <div><strong>Rows extracted</strong><span>${escapeHtml(excelImport.rowsExtracted)}</span></div>
          <div><strong>Rows converted</strong><span>${escapeHtml(excelImport.rowsConverted)}</span></div>
        </div>
        <p>${escapeHtml(excelImport.description || 'No import description recorded.')}</p>
        ${buildReportRows(rows, [{ label: 'Sheet', render: (item) => item.sourceSheetName || '' }, { label: 'Row', render: (item) => item.sourceRowNumber || '' }, { label: 'Summary', render: (item) => item.rawText || '' }, { label: 'Review', render: (item) => humanise(item.status) }])}
      `;
    } else if (type === 'extracted_data') {
      title = 'Extracted Data Review Report';
      bodyHtml = buildReportRows(getBootstrapArray('extractedEntries'), [
        { label: 'Source document', render: (item) => item.documentName || '' },
        { label: 'Sheet/page', render: (item) => item.sourceSheetName || item.sourcePageNumber || '' },
        { label: 'Summary', render: (item) => item.rawText || '' },
        { label: 'Review status', render: (item) => humanise(item.status) },
        { label: 'Conversion', render: (item) => humanise(item.conversionStatus) }
      ]);
    } else if (type === 'activity' && activity) {
      const bundle = getLinkedActivityBundle(activity.id);
      title = `Activity Report: ${activity.title}`;
      bodyHtml = `
        <div class="report-summary-grid">
          <div><strong>Type</strong><span>${escapeHtml(humanise(activity.activityType))}</span></div>
          <div><strong>Date</strong><span>${escapeHtml(formatDate(activity.activityDate))}</span></div>
          <div><strong>Project</strong><span>${escapeHtml(activity.projectTitle || 'Not linked')}</span></div>
          <div><strong>Location</strong><span>${escapeHtml(activity.locationName || 'Not linked')}</span></div>
        </div>
        <p>${escapeHtml(activity.notes || 'No activity notes recorded.')}</p>
        <pre class="report-json-block">${escapeHtml(JSON.stringify(activity.metricsJson || {}, null, 2))}</pre>
        <h3>Maps and spatial evidence</h3>
        ${buildReportRows(bundle.maps || [], [{ label: 'Map', render: (item) => item.title }, { label: 'Source', render: (item) => humanise(item.sourceType || 'reference_only') }, { label: 'Location', render: (item) => item.locationName || '' }, { label: 'Status', render: (item) => humanise(item.status || 'active') }])}
        <h3>Evidence</h3>
        ${buildReportRows(bundle.documents.concat(bundle.photos), [{ label: 'Record', render: (item) => item.originalFilename || item.title || '' }, { label: 'Type', render: (item) => item.fileExtension || humanise(item.category || 'photo_evidence') }, { label: 'Context', render: (item) => item.description || item.projectTitle || '' }])}
        <h3>Reports</h3>
        ${buildReportRows(bundle.reports, [{ label: 'Report', render: (item) => item.reportTitle }, { label: 'Type', render: (item) => humanise(item.reportType) }, { label: 'Created', render: (item) => formatDateTime(item.createdAt) }])}
        <h3>Timeline</h3>
        <div>${bundle.timeline.map((item) => `<div class="report-timeline-item"><strong>${escapeHtml(formatDate(item.entryDate))}</strong> ${escapeHtml(item.title)}</div>`).join('') || 'No timeline entries yet.'}</div>
      `;
    } else {
      title = 'Impact Summary Report';
      const impact = state.bootstrap.dashboard.impactSummary || {};
      bodyHtml = buildReportRows(Object.entries(impact).map(([key, value]) => ({ key, value })), [
        { label: 'Metric', render: (item) => humanise(item.key) },
        { label: 'Value', render: (item) => item.value }
      ]);
    }

    return { title, bodyHtml };
  }

  async function generateReport(formData) {
    const type = formData.get('reportType');
    const project = getProjectById(Number(formData.get('projectId')) || 0);
    const beneficiary = getBeneficiaryById(Number(formData.get('beneficiaryId')) || 0);
    const location = getLocationById(Number(formData.get('locationId')) || 0);
    const excelImport = getExcelImportById(Number(formData.get('excelImportId')) || 0);
    const activity = getActivityById(Number(formData.get('activityId')) || 0);
    const { title, bodyHtml } = buildReportContent(type, { project, beneficiary, location, excelImport, activity });
    state.reportHtml = buildReportSheet(title, bodyHtml, new Date().toISOString(), state.currentUser.fullName);
    byId('reportCanvas').innerHTML = state.reportHtml;
    await callApi('createReportRecord', {
      reportType: type,
      reportTitle: title,
      projectId: project ? project.id : null,
      beneficiaryId: beneficiary ? beneficiary.id : null,
      locationId: location ? location.id : null,
      excelImportId: excelImport ? excelImport.id : null,
      activityId: activity ? activity.id : null,
      filters: Object.fromEntries(formData.entries()),
      summary: title
    });
    showNotification('Report generated.', false);
  }

  function renderReportsHistory() {
    const target = byId('reportsHistory');
    const rows = getBootstrapArray('reports').slice(0, 10);
    renderTable(target, [
      { label: 'Report', render: (row) => `<strong>${escapeHtml(row.reportTitle)}</strong>` },
      { label: 'Type', render: (row) => escapeHtml(humanise(row.reportType)) },
      { label: 'Created', render: (row) => escapeHtml(formatDateTime(row.createdAt)) }
    ], rows, (row) => [
      `<button type="button" class="inline-button report-open" data-id="${row.id}">Open</button>`
    ], 'No report history yet.');
    bindActionButtons(target, {
      '.report-open': (event) => openEntity('report', Number(event.currentTarget.dataset.id))
    });
  }

  function renderUsers() {
    const target = byId('usersTable');
    renderTable(target, [
      { label: 'Name', render: (row) => `<strong>${escapeHtml(row.fullName)}</strong>` },
      { label: 'Username', render: (row) => escapeHtml(row.username) },
      { label: 'Role', render: (row) => escapeHtml(humanise(row.role)) },
      { label: 'Status', render: (row) => badgeHtml(row.status) },
      { label: 'Last login', render: (row) => escapeHtml(formatDateTime(row.lastLoginAt)) }
    ], getBootstrapArray('users'), (row) => [
      `<button type="button" class="inline-button user-edit" data-id="${row.id}">Edit</button>`,
      `<button type="button" class="inline-button user-toggle" data-id="${row.id}" data-status="${row.status}">${row.status === 'active' ? 'Disable' : 'Enable'}</button>`
    ], 'No users yet.');
    bindActionButtons(target, {
      '.user-edit': (event) => {
        const row = getBootstrapArray('users').find((item) => item.id === Number(event.currentTarget.dataset.id));
        const form = byId('userForm');
        getFormField(form, 'id').value = row.id;
        getFormField(form, 'fullName').value = row.fullName;
        getFormField(form, 'username').value = row.username;
        getFormField(form, 'password').value = '';
        getFormField(form, 'role').value = row.role;
        getFormField(form, 'status').value = row.status;
      },
      '.user-toggle': async (event) => {
        const id = Number(event.currentTarget.dataset.id);
        const currentStatus = event.currentTarget.dataset.status;
        await performAction(() => window.environmentApp.setUserStatus({
          userId: id,
          status: currentStatus === 'active' ? 'inactive' : 'active'
        }), 'User status updated.');
      }
    });
  }

  function renderSettings() {
    const branding = getBranding();
    const demoStatus = (state.bootstrap && state.bootstrap.demoStoryStatus) || { loaded: false, loadedAt: '', recordCount: 0 };
    const brandingForm = byId('brandingSettingsForm');
    if (brandingForm) {
      getFormField(brandingForm, 'organisationTitle').value = branding.organisationTitle || '';
      getFormField(brandingForm, 'appTitle').value = branding.appTitle || '';
      getFormField(brandingForm, 'appTagline').value = branding.appTagline || '';
      getFormField(brandingForm, 'mediaSectionLabel').value = branding.mediaSectionLabel || '';
    }
    byId('brandingSettingsSummary').innerHTML = `
      <div class="metric-item"><span>Organisation title</span><strong>${escapeHtml(branding.organisationTitle)}</strong></div>
      <div class="metric-item"><span>App window title</span><strong>${escapeHtml(branding.appTitle)}</strong></div>
      <div class="metric-item"><span>App tagline</span><strong>${escapeHtml(branding.appTagline || 'Not set')}</strong></div>
      <div class="metric-item"><span>Media section label</span><strong>${escapeHtml(branding.mediaSectionLabel || 'Photo Evidence')}</strong></div>
      <div class="metric-item"><span>Logo / letterhead file</span><strong>${escapeHtml(branding.logoPath)}</strong></div>
      <div class="metric-item"><span>App icon file</span><strong>${escapeHtml(branding.iconPath)}</strong></div>
    `;
    byId('demoStorySummary').innerHTML = `
      <div class="metric-item"><span>Demo relationship story</span><strong>${demoStatus.loaded ? 'Loaded' : 'Not loaded'}</strong></div>
      <div class="metric-item"><span>Connected records</span><strong>${escapeHtml(demoStatus.recordCount || 0)}</strong></div>
      <div class="metric-item"><span>Loaded at</span><strong>${escapeHtml(demoStatus.loadedAt ? formatDateTime(demoStatus.loadedAt) : 'Not available')}</strong></div>
    `;
    renderMetricList(byId('categoriesList'), getBootstrapArray('categories').map((item) => ({ label: item.name, value: item.description || '—' })));
    renderMetricList(byId('customFieldsList'), getBootstrapArray('customFields').map((item) => ({
      label: `${item.categoryName || 'All categories'} · ${item.fieldName}`,
      value: `${item.fieldKey} (${item.fieldType})`
    })));
    renderMetricList(byId('mappingProfilesList'), getBootstrapArray('mappingProfiles').map((item) => ({
      label: `${item.profileName} · ${humanise(item.sourceType)}`,
      value: humanise(item.targetRecordType)
    })));
  }

  function applyRoleVisibility() {
    const isAdmin = state.currentUser && state.currentUser.role === 'admin';
    document.querySelectorAll('.admin-only').forEach((node) => {
      node.style.display = isAdmin ? '' : 'none';
    });
  }

  function syncHeader() {
    const databasePath = state.bootstrap.databasePath;
    byId('databasePathText').textContent = formatPathForDisplay(databasePath);
    byId('databasePathText').title = databasePath;
    byId('currentUserSummary').innerHTML = `
      <strong>${escapeHtml(state.currentUser.fullName)}</strong><br>
      <span>${escapeHtml(state.currentUser.username)}</span><br>
      <span>${escapeHtml(humanise(state.currentUser.role))}</span>
    `;
  }

  function getActiveSection() {
    return state.currentSection ? byId(state.currentSection) : null;
  }

  function getSectionTitle(sectionId, fallback = '') {
    const navButton = document.querySelector(`.nav-button[data-section="${sectionId}"]`);
    return navButton?.textContent?.trim() || fallback || sectionId || '';
  }

  function getEntityBreadcrumbLabel(type, id) {
    if (type === 'project') {
      return getProjectById(Number(id))?.title || 'Project';
    }
    if (type === 'project_category') {
      return getCategoryById(Number(id))?.name || 'Project Category';
    }
    if (type === 'beneficiary') {
      return getBeneficiaryById(Number(id))?.name || 'Beneficiary';
    }
    if (type === 'location') {
      return getLocationById(Number(id))?.name || 'Location';
    }
    if (type === 'map') {
      return getMapById(Number(id))?.title || 'Map';
    }
    if (type === 'excel_import') {
      return getExcelImportById(Number(id))?.originalFilename || 'Excel Import';
    }
    if (type === 'document') {
      return getDocumentById(Number(id))?.originalFilename || 'Document';
    }
    if (type === 'photo') {
      return getPhotoById(Number(id))?.title || 'Photo Evidence';
    }
    if (type === 'activity') {
      return getActivityById(Number(id))?.title || 'Activity';
    }
    if (type === 'duty') {
      return getDutyById(Number(id))?.title || 'Duty';
    }
    if (type === 'timeline') {
      return getTimelineById(Number(id))?.title || 'Timeline';
    }
    if (type === 'report') {
      return getReportById(Number(id))?.reportTitle || 'Report';
    }
    if (type === 'project_item') {
      const item = getProjectItemById(Number(id));
      return [item?.itemType, item?.itemSubtype].filter(Boolean).join(' - ') || 'Project Item';
    }
    if (type === 'project_item_subitem') {
      const parentBundle = getLinkedProjectItemBundle(Number(id?.itemId || 0));
      const subItem = getProjectItemSubItemByRef(id);
      return subItem?.name || [parentBundle?.item?.itemType, parentBundle?.item?.itemSubtype].filter(Boolean).join(' - ') || 'Project Sub-item';
    }
    if (type === 'geo') {
      return id?.name || 'Administrative Page';
    }
    return humanise(type || 'record');
  }

  function buildSectionBreadcrumb(sectionId, title) {
    return {
      kind: 'section',
      label: title || getSectionTitle(sectionId),
      sectionId,
      title: title || getSectionTitle(sectionId)
    };
  }

  function setBreadcrumbs(items) {
    state.breadcrumbs = (items || []).filter((item) => item && item.label);
    renderBreadcrumbs();
  }

  function renderBreadcrumbs() {
    const target = byId('pageBreadcrumbs');
    if (!target) {
      return;
    }
    if (!state.breadcrumbs.length) {
      target.innerHTML = '';
      target.classList.add('hidden');
      return;
    }
    target.classList.remove('hidden');
    target.innerHTML = `
      <span class="page-breadcrumbs-label">You are here</span>
      <div class="page-breadcrumbs-trail">
        ${state.breadcrumbs.map((item, index) => {
          const isLast = index === state.breadcrumbs.length - 1;
          const separator = isLast ? '' : '<span class="page-breadcrumb-separator">&gt;&gt;</span>';
          if (isLast) {
            return `<span class="page-breadcrumb-current">${escapeHtml(item.label)}</span>${separator}`;
          }
          return `<button type="button" class="page-breadcrumb-link" data-breadcrumb-index="${index}">${escapeHtml(item.label)}</button>${separator}`;
        }).join('')}
      </div>
    `;
    target.querySelectorAll('[data-breadcrumb-index]').forEach((button) => {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.breadcrumbIndex || 0);
        const crumb = state.breadcrumbs[index];
        if (!crumb) {
          return;
        }
        const retained = state.breadcrumbs.slice(0, index + 1);
        if (crumb.kind === 'section') {
          switchSection(crumb.sectionId, crumb.title || crumb.label, { breadcrumbs: retained });
        } else if (crumb.kind === 'entity') {
          openEntity(crumb.entityType, crumb.entityId, { breadcrumbTrail: retained });
        } else if (crumb.kind === 'calendar_day') {
          openCalendarDay(crumb.dateKey, { breadcrumbTrail: retained });
        }
      });
    });
  }

  function getSaveFormForSection(sectionId) {
    if (!sectionId) {
      return null;
    }
    const section = byId(sectionId);
    if (!section) {
      return null;
    }
    const preferredFormId = state.sectionSaveForms[sectionId];
    if (preferredFormId) {
      const preferredForm = byId(preferredFormId);
      if (preferredForm && preferredForm.closest('.page-section') === section && preferredForm.dataset.pageForm === 'save') {
        return preferredForm;
      }
    }
    return section.querySelector('form[data-page-form="save"]');
  }

  function updatePageActions() {
    const actionBar = byId('pageActionBar');
    const saveButton = byId('pageSaveButton');
    const printButton = byId('pagePrintButton');
    const section = getActiveSection();
    const saveForm = getSaveFormForSection(state.currentSection);

    actionBar.classList.toggle('hidden', !section);
    saveButton.classList.toggle('hidden', !saveForm);
    if (saveForm) {
      saveButton.textContent = saveForm.dataset.saveLabel || 'Save current page data';
    }
    printButton.textContent = state.currentSection === 'reportsSection'
      ? 'Print or save as PDF'
      : 'Print this page';
  }

  function clearPrintTargets() {
    document.querySelectorAll('.page-section.print-target').forEach((section) => {
      section.classList.remove('print-target');
    });
  }

  async function printCurrentSection() {
    const section = getActiveSection();
    if (!section) {
      showNotification('Open a page before printing.', true);
      return;
    }
    clearPrintTargets();
    section.classList.add('print-target');
    try {
      if (window.environmentApp && typeof window.environmentApp.printCurrentWindow === 'function') {
        const result = await callApi('printCurrentWindow');
        if (result && result.savedAsPdf && result.exportPath) {
          showNotification(`No printer was available. The page was saved as PDF to ${result.exportPath}`, false);
        }
      } else {
        window.print();
      }
    } finally {
      clearPrintTargets();
    }
  }

  function switchSection(sectionId, title, options = {}) {
    state.currentSection = sectionId;
    document.querySelectorAll('.page-section').forEach((section) => {
      section.classList.toggle('active-section', section.id === sectionId);
    });
    document.querySelectorAll('.nav-button').forEach((button) => {
      button.classList.toggle('active', button.dataset.section === sectionId);
    });
    byId('pageTitle').textContent = title;
    if (options.breadcrumbs) {
      setBreadcrumbs(options.breadcrumbs);
    } else if (!options.preserveBreadcrumbs) {
      setBreadcrumbs([buildSectionBreadcrumb(sectionId, title)]);
    } else {
      renderBreadcrumbs();
    }
    updatePageActions();
  }

  function filterProjectsLocally(filters) {
    return getBootstrapArray('projects').filter((item) => {
      const query = String(filters.query || '').toLowerCase();
      return (!query || JSON.stringify(item).toLowerCase().includes(query))
        && (!filters.status || item.status === filters.status)
        && (!filters.categoryId || String(item.categoryId) === String(filters.categoryId))
        && (!filters.county || String(item.county || '').toLowerCase().includes(String(filters.county).toLowerCase()));
    });
  }

  function filterBeneficiariesLocally(filters) {
    return getBootstrapArray('beneficiaries').filter((item) => {
      const query = String(filters.query || '').toLowerCase();
      return (!query || JSON.stringify(item).toLowerCase().includes(query))
        && (!filters.type || item.type === filters.type)
        && (!filters.location || JSON.stringify(item).toLowerCase().includes(String(filters.location).toLowerCase()));
    });
  }

  function filterLocationsLocally(filters) {
    return getBootstrapArray('locations').filter((item) => {
      const query = String(filters.query || '').toLowerCase();
      return (!query || JSON.stringify(item).toLowerCase().includes(query))
        && (!filters.locationType || item.locationType === filters.locationType)
        && (!filters.county || String(item.county || '').toLowerCase().includes(String(filters.county).toLowerCase()));
    });
  }

  function deriveProjectItemRecords(projectRows = getBootstrapArray('projects')) {
    return (projectRows || []).flatMap((project) => (project.distributedItems || []).map((item) => ({
      ...item,
      projectId: project.id,
      projectTitle: project.title,
      projectStatus: project.status,
      projectOfficer: project.projectOfficer,
      categoryId: item.categoryId || project.categoryId || null,
      categoryName: getCategoryById(item.categoryId || project.categoryId || null)?.name || project.categoryName || 'Not assigned',
      beneficiaryName: item.relatedBeneficiaryId ? (getBeneficiaryById(Number(item.relatedBeneficiaryId))?.name || 'Linked beneficiary') : '',
      locationName: item.relatedLocationId ? (getLocationById(Number(item.relatedLocationId))?.name || 'Linked location') : '',
      subItems: getProjectItemSubItems(item)
    }))).sort((left, right) => (
      String(right.distributionDate || '').localeCompare(String(left.distributionDate || ''))
      || Number(right.id || 0) - Number(left.id || 0)
    ));
  }

  function getProjectItemById(itemId) {
    return deriveProjectItemRecords().find((item) => Number(item.id) === Number(itemId)) || null;
  }

  function filterProjectItemsLocally(filters) {
    const query = String(filters.query || '').toLowerCase();
    return deriveProjectItemRecords().filter((item) => (
      (!query || JSON.stringify(item).toLowerCase().includes(query))
      && (!filters.projectId || Number(item.projectId) === Number(filters.projectId))
      && (!filters.categoryId || Number(item.categoryId) === Number(filters.categoryId))
      && (!filters.beneficiaryId || Number(item.relatedBeneficiaryId) === Number(filters.beneficiaryId))
      && (!filters.locationId || Number(item.relatedLocationId) === Number(filters.locationId))
    ));
  }

  function buildProjectSavePayload(project, distributedItems) {
    return {
      id: project.id,
      title: project.title,
      projectCode: project.projectCode || '',
      categoryId: project.categoryId || null,
      beneficiaryName: project.beneficiaryName || '',
      contactPerson: project.contactPerson || '',
      contactDetails: project.contactDetails || '',
      status: project.status || 'draft',
      projectStage: project.projectStage || '',
      projectOfficer: project.projectOfficer || '',
      county: project.county || '',
      subCounty: project.subCounty || '',
      ward: project.ward || '',
      village: project.village || '',
      latitude: project.latitude || '',
      longitude: project.longitude || '',
      locationIds: project.locationIds || [],
      beneficiaryIds: project.beneficiaryIds || [],
      dateStarted: project.dateStarted || '',
      dateCompleted: project.dateCompleted || '',
      seedlingsIssued: project.seedlingsIssued ?? '',
      seedlingsSurvived: project.seedlingsSurvived ?? '',
      seedlingsLost: project.seedlingsLost ?? '',
      budgetAmount: project.budgetAmount ?? '',
      actualCost: project.actualCost ?? '',
      donorName: project.donorName || '',
      verificationStatus: project.verificationStatus || '',
      archiveStatus: project.archiveStatus || '',
      seedlingLossReasons: project.seedlingLossReasons || '',
      summary: project.summary || '',
      backgroundStory: project.backgroundStory || '',
      objective: project.objective || '',
      description: project.description || '',
      notes: project.notes || '',
      tags: project.tags || '',
      customData: project.customData || {},
      distributedItems
    };
  }

  function collectProjectItemFormData(form) {
    const existingCustomData = parseJsonSafely(form.customDataJson.value, {});
    const subItems = normaliseProjectItemSubItems(collectProjectItemSubItems());
    const customData = {
      ...(existingCustomData && typeof existingCustomData === 'object' ? existingCustomData : {}),
      ...collectGenericCustomFieldData('project_item')
    };
    if (subItems.length) {
      customData.subItems = subItems;
    } else {
      delete customData.subItems;
    }
    return {
      itemType: form.itemType.value,
      itemSubtype: form.itemSubtype.value,
      unitLabel: form.unitLabel.value,
      status: form.status.value,
      quantityDistributed: form.quantityDistributed.value,
      quantityDestroyed: form.quantityDestroyed.value,
      quantitySurvived: form.quantitySurvived.value,
      quantityReturned: form.quantityReturned.value,
      quantityReplaced: form.quantityReplaced.value,
      distributionDate: form.distributionDate.value,
      relatedProjectId: form.projectId.value ? Number(form.projectId.value) : null,
      relatedBeneficiaryId: form.relatedBeneficiaryId.value ? Number(form.relatedBeneficiaryId.value) : null,
      relatedLocationId: form.relatedLocationId.value ? Number(form.relatedLocationId.value) : null,
      categoryId: form.categoryId.value ? Number(form.categoryId.value) : null,
      notes: form.notes.value,
      customData
    };
  }

  function renderProjectItemIntelligence() {
    const form = byId('projectItemForm');
    const target = form?.querySelector('[data-form-intelligence="project_item"]');
    if (!form || !target) {
      return;
    }
    const project = getProjectById(Number(form.projectId.value || 0));
    const category = getCategoryById(Number(form.categoryId.value || 0));
    const beneficiary = getBeneficiaryById(Number(form.relatedBeneficiaryId.value || 0));
    const location = getLocationById(Number(form.relatedLocationId.value || 0));
    const quantityDistributed = Number(form.quantityDistributed.value || 0);
    const quantityDestroyed = Number(form.quantityDestroyed.value || 0);
    const quantitySurvived = Number(form.quantitySurvived.value || 0);
    const quantityReturned = Number(form.quantityReturned.value || 0);
    const subItems = normaliseProjectItemSubItems(collectProjectItemSubItems());
    const subDistributed = subItems.reduce((total, subItem) => total + (Number(subItem.quantityDistributed || 0) || 0), 0);
    const subSurvived = subItems.reduce((total, subItem) => total + (Number(subItem.quantitySurvived || 0) || 0), 0);
    const subFailed = subItems.reduce((total, subItem) => total + (Number(subItem.quantityFailed || 0) || 0), 0);
    const coverage = getRelationCoverageScore({
      project: !!project,
      category: !!category,
      beneficiary: !!beneficiary,
      location: !!location,
      distributed: quantityDistributed > 0
    });
    const signals = [
      buildCoverageBadge(coverage),
      project ? project.title : 'No project yet',
      category ? category.name : 'No category yet'
    ];
    const actions = [];
    const warnings = [];
    if (quantityDistributed > 0) {
      actions.push(`This row can narrate ${quantityDistributed} ${form.unitLabel.value || 'items'} moving through the organisation record trail.`);
    }
    if (beneficiary) {
      actions.push(`Beneficiary continuity will connect this item row to ${beneficiary.name}.`);
    }
    if (location) {
      actions.push(`Location continuity will anchor this item story in ${location.name}.`);
    }
    if (quantityDestroyed > 0 || quantityReturned > 0) {
      actions.push('Loss, return, and replacement figures will enrich the historical follow-up story for this item row.');
    }
    if (subItems.length) {
      actions.push(`${subItems.length} sub-item rows will preserve species or variant-level history beneath this parent item.`);
      actions.push(`Sub-item totals currently suggest ${subDistributed} distributed, ${subSurvived} survived, and ${subFailed} failed.`);
    } else if (/(seedling|tree|trees|planting|orchard)/i.test(`${form.itemType.value} ${category?.name || ''}`)) {
      warnings.push('This looks like a tree or seedling item row, so consider adding sub-items for each species or variety to strengthen the historical record.');
    }
    if (quantitySurvived > quantityDistributed && quantityDistributed > 0) {
      warnings.push('Survived quantity is above distributed quantity, so review the figures before saving.');
    }
    if (subDistributed > quantityDistributed && quantityDistributed > 0) {
      warnings.push('The combined sub-item quantity is above the parent distributed quantity, so review the species breakdown.');
    }
    if (subSurvived > quantitySurvived && quantitySurvived > 0) {
      warnings.push('Combined sub-item survived quantity is above the parent survived quantity.');
    }
    if (subFailed > quantityDestroyed && quantityDestroyed > 0) {
      warnings.push('Combined sub-item failed quantity is above the parent destroyed quantity.');
    }
    if (!project) {
      warnings.push('Choose the owning project first so this item row can interlink correctly.');
    }
    if (project && beneficiary && !(project.beneficiaryIds || []).includes(beneficiary.id)) {
      warnings.push('The selected beneficiary is not currently linked to this project, so story continuity may be weaker than expected.');
    }
    if (project && location && !(project.locationIds || []).includes(location.id)) {
      warnings.push('The selected location is not currently linked to this project, so this item row may look out of place in project history.');
    }
    if (!beneficiary && !location) {
      warnings.push('Link a beneficiary, location, or both to strengthen recovery and storytelling later.');
    }
    target.innerHTML = renderIntelligencePanel(
      'Project item intelligence',
      'This page treats each project item row as its own operational story fragment while keeping it connected to project, beneficiary, and location history.',
      signals,
      actions,
      warnings
    );
  }

  function populateProjectItemTypeSuggestions(categoryId) {
    const target = byId('projectItemTypeSuggestions');
    if (!target) {
      return;
    }
    const profile = getDistributionProfileByCategoryId(categoryId || '');
    const suggestions = profile?.itemTypeSuggestions || ['Seedlings', 'Cookstove', 'Biogas unit', 'Fingerlings', 'Water tank'];
    target.innerHTML = suggestions.map((item) => `<option value="${escapeHtml(item)}"></option>`).join('');
  }

  function populateProjectItemForm(item = null) {
    const form = byId('projectItemForm');
    if (!form) {
      return;
    }
    form.reset();
    getFormField(form, 'itemId').value = item?.id || '';
    form.projectId.value = item?.projectId || item?.relatedProjectId || '';
    form.categoryId.value = item?.categoryId || '';
    form.itemType.value = item?.itemType || '';
    form.itemSubtype.value = item?.itemSubtype || '';
    form.unitLabel.value = item?.unitLabel || '';
    form.status.value = item?.status || '';
    form.quantityDistributed.value = item?.quantityDistributed ?? '';
    form.quantityDestroyed.value = item?.quantityDestroyed ?? '';
    form.quantitySurvived.value = item?.quantitySurvived ?? '';
    form.quantityReturned.value = item?.quantityReturned ?? '';
    form.quantityReplaced.value = item?.quantityReplaced ?? '';
    form.distributionDate.value = item?.distributionDate || '';
    form.relatedBeneficiaryId.value = item?.relatedBeneficiaryId || '';
    form.relatedLocationId.value = item?.relatedLocationId || '';
    form.notes.value = item?.notes || '';
    setFormCustomData('project_item', item?.customData || {});
    renderProjectItemSubItemsPanel(item?.customData?.subItems || []);
    applySmartProjectContextToForm(form, {
      projectField: 'projectId',
      beneficiaryField: 'relatedBeneficiaryId',
      locationField: 'relatedLocationId',
      categoryField: 'categoryId'
    });
    populateProjectItemTypeSuggestions(form.categoryId.value);
    injectEntityCustomFields('project_item', item?.customData || {});
    renderProjectItemIntelligence();
  }

  async function saveProjectItemRecord(form) {
    const projectId = Number(form.projectId.value || 0);
    const project = getProjectById(projectId);
    if (!project) {
      throw new Error('Choose a valid project before saving a project item.');
    }
    const currentItems = Array.isArray(project.distributedItems) ? [...project.distributedItems] : [];
    const itemId = Number(form.itemId.value || 0);
    const existingItem = itemId ? getProjectItemById(itemId) : null;
    const nextItem = collectProjectItemFormData(form);
    let nextItems;
    if (itemId) {
      const hasMatchInCurrentProject = currentItems.some((item) => Number(item.id) === itemId);
      nextItems = hasMatchInCurrentProject
        ? currentItems.map((item) => (Number(item.id) === itemId ? { ...item, ...nextItem } : item))
        : currentItems.concat(nextItem);
    } else {
      nextItems = currentItems.concat(nextItem);
    }

    await callApi('saveProject', buildProjectSavePayload(project, nextItems));
    if (existingItem && existingItem.projectId && existingItem.projectId !== projectId) {
      const originalProject = getProjectById(existingItem.projectId);
      if (originalProject) {
        const originalItems = (originalProject.distributedItems || []).filter((item) => Number(item.id) !== itemId);
        await callApi('saveProject', buildProjectSavePayload(originalProject, originalItems));
      }
    }
  }

  async function deleteProjectItemRecord(itemId) {
    const item = getProjectItemById(itemId);
    if (!item) {
      throw new Error('Project item was not found.');
    }
    const project = getProjectById(item.projectId);
    if (!project) {
      throw new Error('Owning project was not found.');
    }
    const nextItems = (project.distributedItems || []).filter((row) => Number(row.id) !== Number(itemId));
    await callApi('saveProject', buildProjectSavePayload(project, nextItems));
  }

  function filterPhotosLocally(filters) {
    return getBootstrapArray('photos').filter((item) => {
      const query = String(filters.query || '').toLowerCase();
      return (!query || JSON.stringify(item).toLowerCase().includes(query))
        && (!filters.category || item.category === filters.category)
        && (!filters.projectId || item.projectId === Number(filters.projectId))
        && (!filters.beneficiaryId || item.beneficiaryId === Number(filters.beneficiaryId))
        && (!filters.locationId || item.locationId === Number(filters.locationId));
    });
  }

  function filterMapsLocally(filters) {
    return getBootstrapArray('maps').filter((item) => {
      const query = String(filters.query || '').toLowerCase();
      return (!query || JSON.stringify(item).toLowerCase().includes(query))
        && (!filters.sourceType || item.sourceType === filters.sourceType)
        && (!filters.status || item.status === filters.status)
        && (!filters.projectId || item.projectId === Number(filters.projectId))
        && (!filters.locationId || item.locationId === Number(filters.locationId));
    });
  }

  function filterActivitiesLocally(filters) {
    return getBootstrapArray('activities').filter((item) => {
      const query = String(filters.query || '').toLowerCase();
      return (!query || JSON.stringify(item).toLowerCase().includes(query))
        && (!filters.projectId || item.projectId === Number(filters.projectId))
        && (!filters.locationId || item.locationId === Number(filters.locationId));
    });
  }

  function filterDutiesLocally(filters) {
    return getBootstrapArray('duties').filter((item) => {
      const query = String(filters.query || '').toLowerCase();
      return (!query || JSON.stringify(item).toLowerCase().includes(query))
        && (!filters.status || item.status === filters.status)
        && (!filters.projectId || item.projectId === Number(filters.projectId))
        && (!filters.locationId || item.locationId === Number(filters.locationId));
    });
  }

  function filterTimelineLocally(filters) {
    return getBootstrapArray('timelineEntries').filter((item) => {
      const query = String(filters.query || '').toLowerCase();
      return (!query || JSON.stringify(item).toLowerCase().includes(query))
        && (!filters.entryType || item.entryType === filters.entryType)
        && (!filters.projectId || item.projectId === Number(filters.projectId));
    });
  }

  function padDatePart(value) {
    return String(value || 0).padStart(2, '0');
  }

  function normaliseDateKey(value) {
    if (!value) {
      return '';
    }
    const raw = String(value).trim();
    const directMatch = raw.match(/^(\d{4}-\d{2}-\d{2})/);
    if (directMatch) {
      return directMatch[1];
    }
    const parsed = new Date(raw);
    if (Number.isNaN(parsed.getTime())) {
      return '';
    }
    return `${parsed.getUTCFullYear()}-${padDatePart(parsed.getUTCMonth() + 1)}-${padDatePart(parsed.getUTCDate())}`;
  }

  function normaliseMonthKey(value) {
    const dateKey = normaliseDateKey(value);
    return dateKey ? dateKey.slice(0, 7) : '';
  }

  function getCurrentMonthKey() {
    const now = new Date();
    return `${now.getFullYear()}-${padDatePart(now.getMonth() + 1)}`;
  }

  function formatMonthLabel(monthKey) {
    if (!monthKey) {
      return 'Selected month';
    }
    const parsed = new Date(`${monthKey}-01T00:00:00`);
    if (Number.isNaN(parsed.getTime())) {
      return monthKey;
    }
    return parsed.toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long'
    });
  }

  function getCalendarEventTypeLabel(type) {
    return CALENDAR_EVENT_TYPES.find((item) => item.value === type)?.label || humanise(type);
  }

  function getCalendarEventTone(type) {
    if (type === 'project_completion') return 'success';
    if (type === 'project_planned') return 'warning';
    if (type === 'timeline_event') return 'muted';
    return '';
  }

  function buildCalendarNarrative(event) {
    if (event.eventType === 'item_distribution') {
      return `${event.quantityDistributed || 0} ${event.unitLabel || 'items'} of ${event.itemLabel || 'supplies'} moved from ${event.projectTitle || 'an unlinked project'} to ${event.beneficiaryName || 'an unnamed beneficiary'} at ${event.locationName || 'an unspecified location'}.`;
    }
    if (event.eventType === 'project_planned') {
      return `${event.projectTitle || 'A project'} was recorded as planned${event.actorName ? ` by ${event.actorName}` : ''}${event.locationName ? ` for ${event.locationName}` : ''}.`;
    }
    if (event.eventType === 'project_launch') {
      return `${event.projectTitle || 'A project'} launched${event.actorName ? ` under ${event.actorName}` : ''}${event.locationName ? ` in ${event.locationName}` : ''}${event.beneficiaryName ? ` with ${event.beneficiaryName}` : ''}.`;
    }
    if (event.eventType === 'project_completion') {
      return `${event.projectTitle || 'A project'} reached completion${event.actorName ? ` under ${event.actorName}` : ''}${event.locationName ? ` at ${event.locationName}` : ''}.`;
    }
    if (event.eventType === 'beneficiary_enrolled') {
      return `${event.beneficiaryName || 'A beneficiary'} entered the organisation record cycle${event.projectTitle ? ` through ${event.projectTitle}` : ''}${event.locationName ? ` at ${event.locationName}` : ''}.`;
    }
    if (event.eventType === 'activity_conducted') {
      return `${event.title || 'An activity'} was conducted${event.actorName ? ` by ${event.actorName}` : ''}${event.projectTitle ? ` for ${event.projectTitle}` : ''}${event.locationName ? ` at ${event.locationName}` : ''}.`;
    }
    if (event.eventType === 'duty_assignment') {
      return `${event.title || 'A duty'} was assigned${event.actorName ? ` to ${event.actorName}` : ''}${event.projectTitle ? ` for ${event.projectTitle}` : ''}${event.locationName ? ` at ${event.locationName}` : ''}${event.dueDate ? ` and is due ${formatDate(event.dueDate)}` : ''}.`;
    }
    if (event.eventType === 'map_recorded') {
      return `${event.title || 'A map'} was recorded${event.projectTitle ? ` for ${event.projectTitle}` : ''}${event.locationName ? ` at ${event.locationName}` : ''}${event.actorName ? ` by ${event.actorName}` : ''}.`;
    }
    return `${event.title || 'A timeline event'} was captured${event.projectTitle ? ` for ${event.projectTitle}` : ''}${event.locationName ? ` at ${event.locationName}` : ''}${event.beneficiaryName ? ` with ${event.beneficiaryName}` : ''}.`;
  }

  function deriveCalendarEvents() {
    const events = [];
    const projects = getBootstrapArray('projects');
    const beneficiaries = getBootstrapArray('beneficiaries');
    const activities = getBootstrapArray('activities');
    const duties = getBootstrapArray('duties');
    const maps = getBootstrapArray('maps');
    const timelineEntries = getBootstrapArray('timelineEntries');

    projects.forEach((project) => {
      const primaryBeneficiaryId = Array.isArray(project.beneficiaryIds) && project.beneficiaryIds.length ? Number(project.beneficiaryIds[0]) : null;
      const primaryLocationId = Array.isArray(project.locationIds) && project.locationIds.length ? Number(project.locationIds[0]) : null;
      const beneficiaryName = primaryBeneficiaryId ? getBeneficiaryById(primaryBeneficiaryId)?.name || '' : '';
      const locationName = primaryLocationId ? getLocationById(primaryLocationId)?.name || '' : '';
      if (project.status === 'planned' && !project.dateStarted && project.createdAt) {
        events.push({
          id: `project-planned-${project.id}`,
          dateKey: normaliseDateKey(project.createdAt),
          monthKey: normaliseMonthKey(project.createdAt),
          eventType: 'project_planned',
          title: project.title,
          projectId: project.id,
          projectTitle: project.title,
          beneficiaryId: primaryBeneficiaryId,
          beneficiaryName,
          locationId: primaryLocationId,
          locationName,
          actorName: project.projectOfficer || '',
          sourceEntityType: 'project',
          sourceEntityId: project.id
        });
      }
      if (project.dateStarted) {
        events.push({
          id: `project-start-${project.id}`,
          dateKey: normaliseDateKey(project.dateStarted),
          monthKey: normaliseMonthKey(project.dateStarted),
          eventType: 'project_launch',
          title: project.title,
          projectId: project.id,
          projectTitle: project.title,
          beneficiaryId: primaryBeneficiaryId,
          beneficiaryName,
          locationId: primaryLocationId,
          locationName,
          actorName: project.projectOfficer || '',
          sourceEntityType: 'project',
          sourceEntityId: project.id
        });
      }
      if (project.dateCompleted) {
        events.push({
          id: `project-complete-${project.id}`,
          dateKey: normaliseDateKey(project.dateCompleted),
          monthKey: normaliseMonthKey(project.dateCompleted),
          eventType: 'project_completion',
          title: project.title,
          projectId: project.id,
          projectTitle: project.title,
          beneficiaryId: primaryBeneficiaryId,
          beneficiaryName,
          locationId: primaryLocationId,
          locationName,
          actorName: project.projectOfficer || '',
          sourceEntityType: 'project',
          sourceEntityId: project.id
        });
      }
    });

    deriveProjectItemRecords(projects).forEach((item) => {
      if (!item.distributionDate) {
        return;
      }
      events.push({
        id: `project-item-${item.id}`,
        dateKey: normaliseDateKey(item.distributionDate),
        monthKey: normaliseMonthKey(item.distributionDate),
        eventType: 'item_distribution',
        title: [item.itemType, item.itemSubtype].filter(Boolean).join(' - ') || 'Distributed item',
        itemId: item.id,
        itemLabel: [item.itemType, item.itemSubtype].filter(Boolean).join(' - ') || item.itemType || 'items',
        projectId: item.projectId,
        projectTitle: item.projectTitle,
        beneficiaryId: item.relatedBeneficiaryId || null,
        beneficiaryName: item.beneficiaryName || '',
        locationId: item.relatedLocationId || null,
        locationName: item.locationName || '',
        actorName: item.projectOfficer || '',
        quantityDistributed: Number(item.quantityDistributed || 0) || 0,
        quantityDestroyed: Number(item.quantityDestroyed || 0) || 0,
        quantitySurvived: Number(item.quantitySurvived || 0) || 0,
        quantityReturned: Number(item.quantityReturned || 0) || 0,
        quantityReplaced: Number(item.quantityReplaced || 0) || 0,
        unitLabel: item.unitLabel || '',
        sourceEntityType: 'project_item',
        sourceEntityId: item.id
      });
    });

    beneficiaries.forEach((beneficiary) => {
      if (!beneficiary.createdAt) {
        return;
      }
      const projectId = Array.isArray(beneficiary.projectIds) && beneficiary.projectIds.length ? Number(beneficiary.projectIds[0]) : null;
      const locationId = Array.isArray(beneficiary.locationIds) && beneficiary.locationIds.length ? Number(beneficiary.locationIds[0]) : null;
      events.push({
        id: `beneficiary-${beneficiary.id}`,
        dateKey: normaliseDateKey(beneficiary.createdAt),
        monthKey: normaliseMonthKey(beneficiary.createdAt),
        eventType: 'beneficiary_enrolled',
        title: beneficiary.name,
        projectId,
        projectTitle: projectId ? getProjectById(projectId)?.title || '' : '',
        beneficiaryId: beneficiary.id,
        beneficiaryName: beneficiary.name,
        locationId,
        locationName: locationId ? getLocationById(locationId)?.name || '' : '',
        actorName: '',
        sourceEntityType: 'beneficiary',
        sourceEntityId: beneficiary.id
      });
    });

    activities.forEach((activity) => {
      const eventDate = activity.activityDate || activity.createdAt;
      if (!eventDate) {
        return;
      }
      events.push({
        id: `activity-${activity.id}`,
        dateKey: normaliseDateKey(eventDate),
        monthKey: normaliseMonthKey(eventDate),
        eventType: 'activity_conducted',
        title: activity.title,
        projectId: activity.projectId || null,
        projectTitle: activity.projectTitle || (activity.projectId ? getProjectById(activity.projectId)?.title || '' : ''),
        beneficiaryId: activity.beneficiaryId || null,
        beneficiaryName: activity.beneficiaryName || (activity.beneficiaryId ? getBeneficiaryById(activity.beneficiaryId)?.name || '' : ''),
        locationId: activity.locationId || null,
        locationName: activity.locationName || (activity.locationId ? getLocationById(activity.locationId)?.name || '' : ''),
        actorName: activity.projectTitle ? getProjectById(activity.projectId || 0)?.projectOfficer || '' : '',
        activityId: activity.id,
        activityType: activity.activityType,
        sourceEntityType: 'activity',
        sourceEntityId: activity.id
      });
    });

    duties.forEach((duty) => {
      const eventDate = duty.assignedDate || duty.createdAt;
      if (!eventDate) {
        return;
      }
      events.push({
        id: `duty-${duty.id}`,
        dateKey: normaliseDateKey(eventDate),
        monthKey: normaliseMonthKey(eventDate),
        eventType: 'duty_assignment',
        title: duty.title,
        projectId: duty.projectId || null,
        projectTitle: duty.projectTitle || (duty.projectId ? getProjectById(duty.projectId)?.title || '' : ''),
        beneficiaryId: duty.assignedBeneficiaryId || null,
        beneficiaryName: duty.assignedBeneficiaryName || (duty.assignedBeneficiaryId ? getBeneficiaryById(duty.assignedBeneficiaryId)?.name || '' : ''),
        locationId: duty.locationId || null,
        locationName: duty.locationName || (duty.locationId ? getLocationById(duty.locationId)?.name || '' : ''),
        actorName: duty.assignedUserName || (duty.assignedUserId ? getUserById(duty.assignedUserId)?.fullName || '' : ''),
        dutyId: duty.id,
        dutyType: duty.dutyType,
        dueDate: duty.dueDate || '',
        dutyStatus: duty.status || '',
        priority: duty.priority || '',
        sourceEntityType: 'duty',
        sourceEntityId: duty.id
      });
    });

    maps.forEach((mapRecord) => {
      const eventDate = mapRecord.capturedAt || mapRecord.createdAt;
      if (!eventDate) {
        return;
      }
      events.push({
        id: `map-${mapRecord.id}`,
        dateKey: normaliseDateKey(eventDate),
        monthKey: normaliseMonthKey(eventDate),
        eventType: 'map_recorded',
        title: mapRecord.title,
        projectId: mapRecord.projectId || null,
        projectTitle: mapRecord.projectTitle || (mapRecord.projectId ? getProjectById(mapRecord.projectId)?.title || '' : ''),
        beneficiaryId: mapRecord.beneficiaryId || null,
        beneficiaryName: mapRecord.beneficiaryName || (mapRecord.beneficiaryId ? getBeneficiaryById(mapRecord.beneficiaryId)?.name || '' : ''),
        locationId: mapRecord.locationId || null,
        locationName: mapRecord.locationName || (mapRecord.locationId ? getLocationById(mapRecord.locationId)?.name || '' : ''),
        actorName: '',
        mapId: mapRecord.id,
        dutyId: mapRecord.dutyId || null,
        activityId: mapRecord.activityId || null,
        sourceEntityType: 'map',
        sourceEntityId: mapRecord.id
      });
    });

    timelineEntries.forEach((item) => {
      const eventDate = item.entryDate || item.createdAt;
      if (!eventDate) {
        return;
      }
      events.push({
        id: `timeline-${item.id}`,
        dateKey: normaliseDateKey(eventDate),
        monthKey: normaliseMonthKey(eventDate),
        eventType: 'timeline_event',
        title: item.title,
        projectId: item.projectId || null,
        projectTitle: item.projectTitle || (item.projectId ? getProjectById(item.projectId)?.title || '' : ''),
        beneficiaryId: item.beneficiaryId || null,
        beneficiaryName: item.beneficiaryName || (item.beneficiaryId ? getBeneficiaryById(item.beneficiaryId)?.name || '' : ''),
        locationId: item.locationId || null,
        locationName: item.locationName || (item.locationId ? getLocationById(item.locationId)?.name || '' : ''),
        actorName: item.createdBy ? getUserById(item.createdBy)?.fullName || '' : '',
        timelineId: item.id,
        timelineEntryType: item.entryType,
        sourceEntityType: 'timeline',
        sourceEntityId: item.id
      });
    });

    return events
      .filter((item) => item.dateKey)
      .sort((left, right) => String(right.dateKey).localeCompare(String(left.dateKey)) || String(right.id).localeCompare(String(left.id)));
  }

  function filterCalendarEventsLocally(filters, rows = deriveCalendarEvents()) {
    return rows.filter((item) => {
      const query = String(filters.query || '').toLowerCase();
      return (!query || JSON.stringify(item).toLowerCase().includes(query))
        && (!filters.monthKey || item.monthKey === filters.monthKey)
        && (!filters.eventType || item.eventType === filters.eventType)
        && (!filters.projectId || item.projectId === Number(filters.projectId))
        && (!filters.beneficiaryId || item.beneficiaryId === Number(filters.beneficiaryId))
        && (!filters.locationId || item.locationId === Number(filters.locationId));
    });
  }

  function shiftMonthKey(monthKey, delta) {
    const source = monthKey || getCurrentMonthKey();
    const [year, month] = source.split('-').map(Number);
    const next = new Date(Date.UTC(year, (month - 1) + delta, 1));
    return `${next.getUTCFullYear()}-${padDatePart(next.getUTCMonth() + 1)}`;
  }

  function renderCalendar(rows = state.views.calendar || deriveCalendarEvents()) {
    const monthInput = byId('calendarMonthInput');
    const intelligenceTarget = byId('calendarIntelligence');
    const gridTarget = byId('calendarGrid');
    const clearDayButton = byId('calendarClearDayButton');
    const storyTarget = byId('calendarStorySummary');
    const overviewTarget = byId('calendarDayOverview');
    const relationshipTarget = byId('calendarRelationshipGrid');
    const tableTarget = byId('calendarEventsTable');
    if (!monthInput || !intelligenceTarget || !gridTarget || !storyTarget || !overviewTarget || !relationshipTarget || !tableTarget) {
      return;
    }

    if (!monthInput.value) {
      monthInput.value = getCurrentMonthKey();
    }
    const monthKey = monthInput.value || getCurrentMonthKey();
    const monthRows = rows.filter((item) => item.monthKey === monthKey);
    if (state.selectedCalendarDay && !monthRows.some((item) => item.dateKey === state.selectedCalendarDay)) {
      state.selectedCalendarDay = null;
    }
    const selectedRows = state.selectedCalendarDay
      ? monthRows.filter((item) => item.dateKey === state.selectedCalendarDay)
      : [];
    const itemDistributionTotal = monthRows.reduce((total, item) => total + (item.eventType === 'item_distribution' ? Number(item.quantityDistributed || 0) || 0 : 0), 0);
    const impactedBeneficiaries = new Set(monthRows.map((item) => item.beneficiaryId).filter(Boolean)).size;
    const activeProjects = new Set(monthRows.map((item) => item.projectId).filter(Boolean)).size;

    intelligenceTarget.innerHTML = `
      <div class="calendar-intelligence-grid">
        <div class="calendar-intelligence-card">
          <span>${escapeHtml(formatMonthLabel(monthKey))}</span>
          <strong>${escapeHtml(monthRows.length)}</strong>
          <small>linked calendar events</small>
        </div>
        <div class="calendar-intelligence-card">
          <span>Distribution volume</span>
          <strong>${escapeHtml(itemDistributionTotal)}</strong>
          <small>tracked item units issued this month</small>
        </div>
        <div class="calendar-intelligence-card">
          <span>Project reach</span>
          <strong>${escapeHtml(activeProjects)}</strong>
          <small>projects active in the monthly story cycle</small>
        </div>
        <div class="calendar-intelligence-card">
          <span>Beneficiary touchpoints</span>
          <strong>${escapeHtml(impactedBeneficiaries)}</strong>
          <small>beneficiaries directly named in month events</small>
        </div>
      </div>
    `;

    const [year, month] = monthKey.split('-').map(Number);
    const firstDay = new Date(Date.UTC(year, month - 1, 1));
    const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
    const leadingBlanks = (firstDay.getUTCDay() + 6) % 7;
    const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const cells = [];
    weekdayLabels.forEach((label) => {
      cells.push(`<div class="calendar-weekday">${escapeHtml(label)}</div>`);
    });
    for (let index = 0; index < leadingBlanks; index += 1) {
      cells.push('<div class="calendar-day-empty" aria-hidden="true"></div>');
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      const dateKey = `${monthKey}-${padDatePart(day)}`;
      const dayRows = monthRows.filter((item) => item.dateKey === dateKey);
      cells.push(`
        <button type="button" class="calendar-day-button ${dayRows.length ? 'is-busy' : ''} ${state.selectedCalendarDay === dateKey ? 'is-selected' : ''}" data-calendar-day="${dateKey}">
          <div class="calendar-day-header">
            <span class="calendar-day-number">${escapeHtml(day)}</span>
            <span class="calendar-day-count">${escapeHtml(dayRows.length)} event${dayRows.length === 1 ? '' : 's'}</span>
          </div>
          <div class="calendar-day-events">
            ${dayRows.slice(0, 3).map((item) => `
              <div class="calendar-day-event">
                <strong>${escapeHtml(getCalendarEventTypeLabel(item.eventType))}</strong>
                <small>${escapeHtml(item.projectTitle || item.beneficiaryName || item.locationName || item.title || 'Linked record')}</small>
              </div>
            `).join('') || '<div class="calendar-day-event"><small>No recorded activity yet.</small></div>'}
          </div>
        </button>
      `);
    }
    gridTarget.innerHTML = `<div class="calendar-grid">${cells.join('')}</div>`;

    const storyTitle = state.selectedCalendarDay
      ? `Focused on ${formatDate(state.selectedCalendarDay)} with ${selectedRows.length} linked event${selectedRows.length === 1 ? '' : 's'}.`
      : `Select any day in ${formatMonthLabel(monthKey)} to open a full-width relationship view for that day’s operational story.`;
    storyTarget.innerHTML = `
      <div class="helper-block calendar-story-summary">
        <p>${escapeHtml(storyTitle)}</p>
      </div>
    `;

    if (!state.selectedCalendarDay) {
      overviewTarget.innerHTML = renderDetailCards([
        { label: 'Month', value: formatMonthLabel(monthKey) },
        { label: 'Visible events', value: monthRows.length },
        { label: 'Projects represented', value: activeProjects },
        { label: 'Beneficiary touchpoints', value: impactedBeneficiaries },
        { label: 'Distribution volume', value: itemDistributionTotal }
      ]);
      relationshipTarget.innerHTML = `<div class="empty-state">Click a day in the monthly calendar above to open its full relationship view.</div>`;
      renderEmptyState(tableTarget, 'Select a day to load its full event ledger.');
    } else {
      const linkedProjects = uniqueEntities(selectedRows.map((item) => item.projectId ? getProjectById(item.projectId) : null));
      const linkedBeneficiaries = uniqueEntities(selectedRows.map((item) => item.beneficiaryId ? getBeneficiaryById(item.beneficiaryId) : null));
      const linkedLocations = uniqueEntities(selectedRows.map((item) => item.locationId ? getLocationById(item.locationId) : null));
      const linkedActivities = uniqueEntities(selectedRows.map((item) => item.activityId ? getActivityById(item.activityId) : null));
      const linkedDuties = uniqueEntities(selectedRows.map((item) => item.dutyId ? getDutyById(item.dutyId) : null));
      const linkedMaps = uniqueEntities(selectedRows.map((item) => item.mapId ? getMapById(item.mapId) : null));
      const linkedTimeline = uniqueEntities(selectedRows.map((item) => item.timelineId ? getTimelineById(item.timelineId) : null));
      const linkedReports = uniqueEntities(selectedRows.map((item) => item.reportId ? getReportById(item.reportId) : null));
      const linkedCategories = uniqueEntities(linkedProjects.map((item) => item?.categoryId ? getCategoryById(item.categoryId) : null));
      const linkedDistributionEvents = selectedRows.filter((item) => item.itemId);
      overviewTarget.innerHTML = `
        ${renderStoryCallout(`The day view reconstructs ${formatDate(state.selectedCalendarDay)} as one connected operating story across projects, beneficiaries, locations, activities, duties, timeline notes, and tracked distributed items.`)}
        ${renderDetailCards([
          { label: 'Selected day', value: formatDate(state.selectedCalendarDay) },
          { label: 'Events captured', value: selectedRows.length },
          { label: 'Projects touched', value: linkedProjects.length },
          { label: 'Beneficiaries touched', value: linkedBeneficiaries.length },
          { label: 'Locations touched', value: linkedLocations.length }
        ])}
      `;
      relationshipTarget.innerHTML = `
        <div class="linked-grid">
          ${renderEntityGroup('Project categories on this day', linkedCategories.map(projectCategoryTile), 'No linked project categories.')}
          ${renderEntityGroup('Projects on this day', linkedProjects.map(projectTile), 'No linked projects.')}
          ${renderEntityGroup('Beneficiaries on this day', linkedBeneficiaries.map(beneficiaryTile), 'No linked beneficiaries.')}
          ${renderEntityGroup('Locations on this day', linkedLocations.map(locationTile), 'No linked locations.')}
          ${renderEntityGroup('Activities on this day', linkedActivities.map(activityTile), 'No linked activities.')}
          ${renderEntityGroup('Duties on this day', linkedDuties.map(dutyTile), 'No linked duties.')}
          ${renderEntityGroup('Maps on this day', linkedMaps.map(mapTile), 'No linked maps.')}
          ${renderEntityGroup('Reports on this day', linkedReports.map(reportTile), 'No linked reports.')}
          ${renderEntityGroup('Timeline notes on this day', linkedTimeline.map(timelineTile), 'No linked timeline notes.')}
          ${renderEntityGroup('Distributed items on this day', linkedDistributionEvents.map(calendarDistributionTile), 'No linked distribution rows.')}
        </div>
      `;
      renderTable(tableTarget, [
        { label: 'Date', render: (row) => `<strong>${escapeHtml(formatDate(row.dateKey))}</strong><small>${escapeHtml(getCalendarEventTypeLabel(row.eventType))}</small>` },
        { label: 'Story', render: (row) => `<strong>${escapeHtml(row.title || getCalendarEventTypeLabel(row.eventType))}</strong><small>${escapeHtml(buildCalendarNarrative(row))}</small>` },
        { label: 'Links', render: (row) => `
          ${row.projectId ? `<div>${badgeHtml(row.projectTitle || 'Project')}</div>` : ''}
          ${row.beneficiaryId ? `<div>${badgeHtml(row.beneficiaryName || 'Beneficiary', 'muted')}</div>` : ''}
          ${row.locationId ? `<div>${badgeHtml(row.locationName || 'Location', 'warning')}</div>` : ''}
          ${row.actorName ? `<small>By ${escapeHtml(row.actorName)}</small>` : ''}
        ` }
      ], selectedRows, (row) => {
        const actions = [];
        if (row.projectId) {
          actions.push(`<button type="button" class="inline-button entity-deep-link" data-entity-type="project" data-entity-id="${row.projectId}">Project</button>`);
        }
        if (row.beneficiaryId) {
          actions.push(`<button type="button" class="inline-button entity-deep-link" data-entity-type="beneficiary" data-entity-id="${row.beneficiaryId}">Beneficiary</button>`);
        }
        if (row.locationId) {
          actions.push(`<button type="button" class="inline-button entity-deep-link" data-entity-type="location" data-entity-id="${row.locationId}">Location</button>`);
        }
        if (row.activityId) {
          actions.push(`<button type="button" class="inline-button entity-deep-link" data-entity-type="activity" data-entity-id="${row.activityId}">Activity</button>`);
        }
        if (row.dutyId) {
          actions.push(`<button type="button" class="inline-button entity-deep-link" data-entity-type="duty" data-entity-id="${row.dutyId}">Duty</button>`);
        }
        if (row.mapId) {
          actions.push(`<button type="button" class="inline-button" data-open-map-id="${row.mapId}">Map</button>`);
        }
        if (row.timelineId) {
          actions.push(`<button type="button" class="inline-button entity-deep-link" data-entity-type="timeline" data-entity-id="${row.timelineId}">Timeline</button>`);
        }
        if (row.reportId) {
          actions.push(`<button type="button" class="inline-button entity-deep-link" data-entity-type="report" data-entity-id="${row.reportId}">Report</button>`);
        }
        if (row.itemId) {
          actions.push(`<button type="button" class="inline-button entity-deep-link" data-entity-type="project_item" data-entity-id="${row.itemId}">Item page</button>`);
          actions.push(`<button type="button" class="inline-button calendar-edit-item" data-item-id="${row.itemId}">Edit item</button>`);
        }
        return actions;
      }, 'No calendar events match the current filters.');
    }

    bindEntityActions(tableTarget);
    bindEntityActions(relationshipTarget);
    bindActionButtons(relationshipTarget, {
      '.calendar-edit-item': (event) => {
        const itemId = Number(event.currentTarget.dataset.itemId);
        populateProjectItemForm(getProjectItemById(itemId));
        switchSection('projectItemsSection', 'Project Items');
      }
    });
    bindActionButtons(tableTarget, {
      '.calendar-edit-item': (event) => {
        const itemId = Number(event.currentTarget.dataset.itemId);
        populateProjectItemForm(getProjectItemById(itemId));
        switchSection('projectItemsSection', 'Project Items');
      }
    });

    gridTarget.querySelectorAll('[data-calendar-day]').forEach((button) => {
      button.addEventListener('click', () => {
        state.selectedCalendarDay = button.dataset.calendarDay;
        setTablePage('calendarEventsTable', 1);
        renderCalendar(state.views.calendar || deriveCalendarEvents());
        if (state.selectedCalendarDay) {
          byId('calendarDayTitle').textContent = `Calendar Day: ${formatDate(state.selectedCalendarDay)}`;
          switchSection('calendarDaySection', `Calendar Day: ${formatDate(state.selectedCalendarDay)}`);
        }
      });
    });

    if (clearDayButton) {
      clearDayButton.textContent = state.selectedCalendarDay ? `Show whole month instead of ${formatDate(state.selectedCalendarDay)}` : 'Show whole month';
    }
  }

  function populateSelects() {
    const categories = getBootstrapArray('categories').map((item) => ({ value: item.id, label: item.name }));
    const projects = getBootstrapArray('projects').map((item) => ({ value: item.id, label: item.title }));
    const beneficiaries = getBootstrapArray('beneficiaries').map((item) => ({ value: item.id, label: item.name }));
    const locations = getBootstrapArray('locations').map((item) => ({ value: item.id, label: item.name }));
    const activities = getBootstrapArray('activities').map((item) => ({ value: item.id, label: item.title }));
    const duties = getBootstrapArray('duties').map((item) => ({ value: item.id, label: item.title }));
    const users = getBootstrapArray('users').map((item) => ({ value: item.id, label: item.fullName }));
    const excelImports = getBootstrapArray('excelImports').map((item) => ({ value: item.id, label: item.originalFilename }));
    const locationTypes = (state.bootstrap.lookups && state.bootstrap.lookups.locationTypes) || [];

    fillSelect(byId('projectCategorySelect'), categories, 'Select category');
    fillSelect(byId('projectSearchCategory'), categories, 'All categories');
    fillSelect(byId('projectStatusSelect'), PROJECT_STATUSES, 'Select status');
    fillSelect(byId('projectSearchStatus'), PROJECT_STATUSES, 'All statuses');
    fillMultiSelect(byId('projectLocationSelect'), locations);
    fillMultiSelect(byId('projectBeneficiarySelect'), beneficiaries);
    fillSelect(byId('projectItemsFilterProject'), projects, 'All projects');
    fillSelect(byId('projectItemsFilterCategory'), categories, 'All categories');
    fillSelect(byId('projectItemsFilterBeneficiary'), beneficiaries, 'All beneficiaries');
    fillSelect(byId('projectItemsFilterLocation'), locations, 'All locations');
    fillSelect(byId('projectItemProjectSelect'), projects, 'Select project');
    fillSelect(byId('projectItemCategorySelect'), categories, 'Select category');
    fillSelect(byId('projectItemBeneficiarySelect'), beneficiaries, 'No linked beneficiary');
    fillSelect(byId('projectItemLocationSelect'), locations, 'No linked location');

    fillSelect(byId('beneficiaryTypeSelect'), BENEFICIARY_TYPES);
    fillSelect(byId('beneficiarySearchType'), BENEFICIARY_TYPES, 'All types');
    fillMultiSelect(byId('beneficiaryLocationSelect'), locations);
    fillMultiSelect(byId('beneficiaryProjectSelect'), projects);

    fillSelect(byId('locationTypeSelect'), locationTypes);
    fillSelect(byId('locationTypeFilter'), locationTypes, 'All location types');

    fillSelect(byId('excelProjectSelect'), projects, 'No linked project');
    fillSelect(byId('excelBeneficiarySelect'), beneficiaries, 'No linked beneficiary');
    fillSelect(byId('excelLocationSelect'), locations, 'No linked location');

    fillSelect(byId('documentProjectSelect'), projects, 'No linked project');
    fillSelect(byId('documentBeneficiarySelect'), beneficiaries, 'No linked beneficiary');
    fillSelect(byId('documentLocationSelect'), locations, 'No linked location');
    fillSelect(byId('documentActivitySelect'), activities, 'No linked activity');
    fillSelect(byId('documentCategorySelect'), categories, 'No category');

    fillSelect(byId('photoProjectSelect'), projects, 'No linked project');
    fillSelect(byId('photoBeneficiarySelect'), beneficiaries, 'No linked beneficiary');
    fillSelect(byId('photoLocationSelect'), locations, 'No linked location');
    fillSelect(byId('photoActivitySelect'), activities, 'No linked activity');
    fillSelect(byId('photoFilterCategory'), PHOTO_CATEGORIES, 'All photo categories');
    fillSelect(byId('photoFilterProject'), projects, 'All projects');
    fillSelect(byId('photoFilterBeneficiary'), beneficiaries, 'All beneficiaries');
    fillSelect(byId('photoFilterLocation'), locations, 'All locations');

    fillSelect(byId('mapSourceTypeSelect'), MAP_SOURCE_TYPES);
    fillSelect(byId('mapProviderSelect'), MAP_PROVIDERS);
    fillSelect(byId('mapStatusSelect'), MAP_STATUSES);
    fillSelect(byId('mapProjectSelect'), projects, 'No linked project');
    fillSelect(byId('mapBeneficiarySelect'), beneficiaries, 'No linked beneficiary');
    fillSelect(byId('mapLocationSelect'), locations, 'No linked location');
    fillSelect(byId('mapActivitySelect'), activities, 'No linked activity');
    fillSelect(byId('mapDutySelect'), duties, 'No linked duty');
    fillSelect(byId('mapFilterSourceType'), MAP_SOURCE_TYPES, 'All source types');
    fillSelect(byId('mapFilterProject'), projects, 'All projects');
    fillSelect(byId('mapFilterLocation'), locations, 'All locations');
    fillSelect(byId('mapFilterStatus'), MAP_STATUSES, 'All statuses');

    fillSelect(byId('activityTypeSelect'), ACTIVITY_TYPES);
    fillSelect(byId('activityStatusSelect'), ACTIVITY_STATUSES);
    fillSelect(byId('activityCategorySelect'), categories, 'No category');
    fillSelect(byId('activityProjectSelect'), projects, 'No linked project');
    fillSelect(byId('activityBeneficiarySelect'), beneficiaries, 'No linked beneficiary');
    fillSelect(byId('activityLocationSelect'), locations, 'No linked location');
    fillSelect(byId('activityFilterProject'), projects, 'All projects');
    fillSelect(byId('activityFilterLocation'), locations, 'All locations');

    fillSelect(byId('dutyAssignedUserSelect'), users, 'No assigned user');
    fillSelect(byId('dutyAssignedBeneficiarySelect'), beneficiaries, 'No assigned beneficiary');
    fillSelect(byId('dutyProjectSelect'), projects, 'No linked project');
    fillSelect(byId('dutyLocationSelect'), locations, 'No linked location');
    fillSelect(byId('dutyStatusSelect'), DUTY_STATUSES);
    fillSelect(byId('dutyPrioritySelect'), DUTY_PRIORITIES);
    fillSelect(byId('dutyFilterStatus'), DUTY_STATUSES, 'All duty statuses');
    fillSelect(byId('dutyFilterProject'), projects, 'All projects');
    fillSelect(byId('dutyFilterLocation'), locations, 'All locations');

    fillSelect(byId('timelineTypeSelect'), TIMELINE_TYPES);
    fillSelect(byId('timelineProjectSelect'), projects, 'No linked project');
    fillSelect(byId('timelineBeneficiarySelect'), beneficiaries, 'No linked beneficiary');
    fillSelect(byId('timelineLocationSelect'), locations, 'No linked location');
    fillSelect(byId('timelineActivitySelect'), activities, 'No linked activity');
    fillSelect(byId('timelineDocumentSelect'), getBootstrapArray('documents').map((item) => ({ value: item.id, label: item.originalFilename })), 'No linked document');
    fillSelect(byId('timelinePhotoSelect'), getBootstrapArray('photos').map((item) => ({ value: item.id, label: item.title })), 'No linked photo');
    fillSelect(byId('timelineExcelSelect'), excelImports, 'No linked Excel import');
    fillSelect(byId('timelineFilterType'), TIMELINE_TYPES, 'All timeline types');
    fillSelect(byId('timelineFilterProject'), projects, 'All projects');

    fillSelect(byId('calendarFilterType'), CALENDAR_EVENT_TYPES, 'All calendar event types');
    fillSelect(byId('calendarFilterProject'), projects, 'All projects');
    fillSelect(byId('calendarFilterBeneficiary'), beneficiaries, 'All beneficiaries');
    fillSelect(byId('calendarFilterLocation'), locations, 'All locations');

    fillSelect(byId('reportTypeSelect'), REPORT_TYPES);
    fillSelect(byId('reportProjectSelect'), projects, 'Any project');
    fillSelect(byId('reportBeneficiarySelect'), beneficiaries, 'Any beneficiary');
    fillSelect(byId('reportLocationSelect'), locations, 'Any location');
    fillSelect(byId('reportExcelSelect'), excelImports, 'Any Excel import');
    fillSelect(byId('reportActivitySelect'), activities, 'Any activity');

    fillSelect(byId('userRoleSelect'), USER_ROLES);
    fillSelect(byId('userStatusSelect'), USER_STATUSES);
    fillSelect(byId('customFieldEntityTypeSelect'), CUSTOM_FIELD_ENTITY_OPTIONS);
    fillSelect(byId('customFieldCategorySelect'), categories, 'All categories');
    fillSelect(byId('customFieldTypeSelect'), FIELD_TYPES);
    fillSelect(byId('customFieldInsertAfterSelect'), getCustomFieldInsertOptions(byId('customFieldEntityTypeSelect')?.value || 'project'), 'End of selected form');
    renderAllEntityCustomFields();
    syncActivityTypeFromCategory(false);
    if (!getFormField(byId('projectForm'), 'id').value) {
      resetDistributedItemsPanel('project');
    }
    if (!getFormField(byId('beneficiaryForm'), 'id').value) {
      resetDistributedItemsPanel('beneficiary');
    }
    if (!getFormField(byId('locationForm'), 'id').value) {
      resetDistributedItemsPanel('location');
    }
  }

  function renderAll() {
    populateSelects();
    renderAllFormIntelligence();
    renderDashboard();
    renderEntityPage();
    renderProjects(state.views.projects || getBootstrapArray('projects'));
    renderCategories();
    renderProjectDetail();
    renderProjectItems(state.views.projectItems || deriveProjectItemRecords());
    const projectItemForm = byId('projectItemForm');
    populateProjectItemForm(getProjectItemById(Number((projectItemForm && getFormField(projectItemForm, 'itemId')?.value) || 0)));
    renderBeneficiaries(state.views.beneficiaries || getBootstrapArray('beneficiaries'));
    renderBeneficiaryDetail();
    renderLocations(state.views.locations || getBootstrapArray('locations'));
    renderLocationDetail();
    renderExcelImports(getBootstrapArray('excelImports'));
    renderExcelConsole();
    bindExcelEditorSelects();
    renderDocuments(getBootstrapArray('documents'));
    renderDocumentDetail();
    renderPhotos(state.views.photos || getBootstrapArray('photos'));
    renderMaps(state.views.maps || getBootstrapArray('maps'));
    renderMapDetail();
    const mapForm = byId('mapForm');
    populateMapForm(getMapById(Number((mapForm && getFormField(mapForm, 'id')?.value) || 0)));
    renderActivities(state.views.activities || getBootstrapArray('activities'));
    renderDuties(state.views.duties || getBootstrapArray('duties'));
    renderDutyAssignmentPage();
    const dutyForm = byId('dutyForm');
    populateDutyForm(getDutyById(Number((dutyForm && getFormField(dutyForm, 'id')?.value) || 0)));
    renderTimeline(state.views.timeline || getBootstrapArray('timelineEntries'));
    renderCalendar(state.views.calendar || deriveCalendarEvents());
    renderReportsHistory();
    renderAboutPage();
    renderFaqPage();
    renderPricing();
    renderCopyright();
    renderUsers();
    renderSettings();
    renderCustomFieldManager(getBootstrapArray('customFields'));
  }

  async function refreshBootstrap() {
    const response = await callApi('getBootstrap');
    state.bootstrap = response;
    state.currentUser = response.currentUser;
    state.views = {
      projects: response.projects,
      projectItems: deriveProjectItemRecords(response.projects),
      beneficiaries: response.beneficiaries,
      locations: response.locations,
      photos: response.photos,
      maps: response.maps,
      activities: response.activities,
      duties: response.duties,
      timeline: response.timelineEntries,
      calendar: deriveCalendarEvents()
    };

    if (state.currentUser) {
      applyBranding();
      applyRoleVisibility();
      syncHeader();
      byId('loginView').classList.add('hidden');
      byId('appView').classList.remove('hidden');
      renderAll();
    } else {
      applyBranding();
      byId('loginView').classList.remove('hidden');
      byId('appView').classList.add('hidden');
      byId('defaultCredentials').textContent = `${response.defaultCredentials.username} / ${response.defaultCredentials.password}`;
      byId('initialAdminForm').classList.toggle('hidden', !(response.setup && response.setup.activeUsers === 0));
    }
  }

  function resetForms() {
    ['projectForm', 'categoryForm', 'projectItemForm', 'beneficiaryForm', 'locationForm', 'activityForm', 'userForm', 'documentForm', 'photoForm', 'mapForm', 'dutyForm', 'timelineForm'].forEach((id) => {
      const form = byId(id);
      if (form) {
        form.reset();
        if (form.elements.namedItem('id')) {
          form.elements.namedItem('id').value = '';
        }
      }
    });
    setMultipleSelectValues(byId('projectLocationSelect'), []);
    setMultipleSelectValues(byId('projectBeneficiarySelect'), []);
    setMultipleSelectValues(byId('beneficiaryLocationSelect'), []);
    setMultipleSelectValues(byId('beneficiaryProjectSelect'), []);
    Object.keys(CUSTOM_FIELD_FORM_CONFIG).forEach((entityType) => setFormCustomData(entityType, {}));
    renderAllEntityCustomFields();
  }

  function bindEvents() {
    document.querySelectorAll('.nav-button').forEach((button) => {
      button.addEventListener('click', () => switchSection(button.dataset.section, button.textContent));
    });

    document.addEventListener('focusin', (event) => {
      const form = event.target && event.target.form;
      if (!form || form.dataset.pageForm !== 'save' || !form.id) {
        return;
      }
      const section = form.closest('.page-section');
      if (!section) {
        return;
      }
      state.sectionSaveForms[section.id] = form.id;
      if (section.id === state.currentSection) {
        updatePageActions();
      }
    });

    byId('pageSaveButton').addEventListener('click', () => {
      const form = getSaveFormForSection(state.currentSection);
      if (!form) {
        showNotification('There is no save form on this page.', true);
        return;
      }
      form.requestSubmit();
    });

    byId('pagePrintButton').addEventListener('click', async () => {
      try {
        await printCurrentSection();
      } catch (error) {
        showNotification(error.message, true);
      }
    });

    byId('loginForm').addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const formData = new FormData(form);
      await performAction(() => window.environmentApp.login({
        username: formData.get('username'),
        password: formData.get('password')
      }), 'Signed in successfully.');
      form.reset();
    });

    byId('initialAdminForm').addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const formData = new FormData(form);
      await performAction(() => window.environmentApp.createInitialAdmin({
        fullName: formData.get('fullName'),
        username: formData.get('username'),
        password: formData.get('password')
      }), 'Initial admin user created.');
      form.reset();
    });

    byId('logoutButton').addEventListener('click', async () => {
      await performAction(() => window.environmentApp.logout(), 'Signed out.');
    });

    bindAutoFilterForm('projectSearchForm', (event) => {
      event.preventDefault();
      setTablePage('projectsTable', 1);
      state.views.projects = filterProjectsLocally(Object.fromEntries(new FormData(event.currentTarget).entries()));
      renderProjects(state.views.projects);
    });

    bindAutoFilterForm('projectItemsSearchForm', (event) => {
      event.preventDefault();
      setTablePage('projectItemsTable', 1);
      state.views.projectItems = filterProjectItemsLocally(Object.fromEntries(new FormData(event.currentTarget).entries()));
      renderProjectItems(state.views.projectItems);
    });

    byId('projectCategorySelect').addEventListener('change', (event) => {
      renderProjectCategoryFields(event.currentTarget.value, parseJsonField(byId('projectForm').elements.namedItem('customData').value || '{}', {}));
    });

    byId('projectItemCategorySelect').addEventListener('change', (event) => {
      populateProjectItemTypeSuggestions(event.currentTarget.value);
      injectEntityCustomFields('project_item', getFormCustomData('project_item'));
      renderProjectItemIntelligence();
    });

    byId('documentCategorySelect').addEventListener('change', () => {
      injectEntityCustomFields('document', getFormCustomData('document'));
    });

    byId('customFieldEntityTypeSelect').addEventListener('change', (event) => {
      const entityType = event.currentTarget.value || 'project';
      fillSelect(byId('customFieldInsertAfterSelect'), getCustomFieldInsertOptions(entityType), 'End of selected form');
      syncCustomFieldCategoryAvailability(entityType);
    });

    byId('projectItemProjectSelect').addEventListener('change', (event) => {
      const project = getProjectById(Number(event.currentTarget.value || 0));
      const form = byId('projectItemForm');
      if (project && !form.categoryId.value) {
        form.categoryId.value = project.categoryId || '';
      }
      applySmartProjectContextToForm(form, {
        projectField: 'projectId',
        beneficiaryField: 'relatedBeneficiaryId',
        locationField: 'relatedLocationId',
        categoryField: 'categoryId'
      });
      populateProjectItemTypeSuggestions(form.categoryId.value || project?.categoryId || '');
      renderProjectItemIntelligence();
    });

    byId('projectItemForm').addEventListener('input', () => {
      renderProjectItemIntelligence();
    });
    byId('projectItemAddSubItemButton').addEventListener('click', () => {
      const currentRows = collectProjectItemSubItems(true);
      currentRows.push({});
      renderProjectItemSubItemsPanel(currentRows);
      renderProjectItemIntelligence();
    });
    ['relatedBeneficiaryId', 'relatedLocationId'].forEach((fieldName) => {
      getFormField(byId('projectItemForm'), fieldName).addEventListener('change', () => {
        applySmartProjectContextToForm(byId('projectItemForm'), {
          projectField: 'projectId',
          beneficiaryField: 'relatedBeneficiaryId',
          locationField: 'relatedLocationId',
          categoryField: 'categoryId'
        });
        renderProjectItemIntelligence();
      });
    });

    byId('projectItemForm').addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      try {
        await saveProjectItemRecord(form);
        await refreshBootstrap();
        populateProjectItemForm();
        showNotification('Project item saved.', false);
      } catch (error) {
        showNotification(error.message, true);
      }
    });

    byId('projectItemFormReset').addEventListener('click', () => {
      populateProjectItemForm();
    });

    byId('projectAddDistributedItemButton').addEventListener('click', () => {
      appendDistributedItemRow('project');
    });

    byId('projectForm').addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const seedlingFieldsEnabled = categorySupportsSeedlingOutcomes(form.categoryId.value);
      try {
        const result = await callApi('saveProject', {
          id: getFormField(form, 'id').value ? Number(getFormField(form, 'id').value) : null,
          title: form.title.value,
          projectCode: form.projectCode.value,
          categoryId: form.categoryId.value ? Number(form.categoryId.value) : null,
          status: form.status.value,
          projectStage: form.projectStage.value,
          projectOfficer: form.projectOfficer.value,
          county: form.county.value,
          subCounty: form.subCounty.value,
          ward: form.ward.value,
          village: form.village.value,
          latitude: form.latitude.value,
          longitude: form.longitude.value,
          locationIds: getMultipleSelectValues(byId('projectLocationSelect')),
          beneficiaryIds: getMultipleSelectValues(byId('projectBeneficiarySelect')),
          dateStarted: form.dateStarted.value,
          dateCompleted: form.dateCompleted.value,
          seedlingsIssued: seedlingFieldsEnabled ? form.seedlingsIssued.value : '',
          seedlingsSurvived: seedlingFieldsEnabled ? form.seedlingsSurvived.value : '',
          seedlingsLost: seedlingFieldsEnabled ? form.seedlingsLost.value : '',
          budgetAmount: form.budgetAmount.value,
          actualCost: form.actualCost.value,
          donorName: form.donorName.value,
          verificationStatus: form.verificationStatus.value,
          seedlingLossReasons: seedlingFieldsEnabled ? form.seedlingLossReasons.value : '',
          summary: form.summary.value,
          backgroundStory: form.backgroundStory.value,
          objective: form.objective.value,
          description: form.description.value,
          notes: form.notes.value,
          tags: form.tags.value,
          distributedItems: collectDistributedItems('project'),
          customData: {
            ...parseJsonField(form.customData.value || '{}', {}),
            ...collectProjectCategoryFieldData()
          }
        });
        await uploadEntityMediaFiles('project', result.project, form);
        await refreshBootstrap();
        openEntity('project', result.project.id);
        form.reset();
        getFormField(form, 'id').value = '';
        setMultipleSelectValues(byId('projectLocationSelect'), []);
        setMultipleSelectValues(byId('projectBeneficiarySelect'), []);
        resetDistributedItemsPanel('project');
        renderFormIntelligence('project');
        showNotification('Project saved.', false);
      } catch (error) {
        showNotification(error.message, true);
      }
    });

    byId('projectFormReset').addEventListener('click', () => {
      byId('projectForm').reset();
      getFormField(byId('projectForm'), 'id').value = '';
      setMultipleSelectValues(byId('projectLocationSelect'), []);
      setMultipleSelectValues(byId('projectBeneficiarySelect'), []);
      resetDistributedItemsPanel('project');
      renderProjectCategoryFields('', {});
      renderFormIntelligence('project');
    });

    bindAutoFilterForm('beneficiarySearchForm', (event) => {
      event.preventDefault();
      setTablePage('beneficiariesTable', 1);
      state.views.beneficiaries = filterBeneficiariesLocally(Object.fromEntries(new FormData(event.currentTarget).entries()));
      renderBeneficiaries(state.views.beneficiaries);
    });

    byId('beneficiaryAddDistributedItemButton').addEventListener('click', () => {
      appendDistributedItemRow('beneficiary');
    });

    byId('beneficiaryForm').addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      try {
        const result = await callApi('saveBeneficiary', {
          id: getFormField(form, 'id').value ? Number(getFormField(form, 'id').value) : null,
          name: form.name.value,
          type: form.type.value,
          beneficiaryCode: form.beneficiaryCode.value,
          status: form.status.value,
          county: form.county.value,
          subCounty: form.subCounty.value,
          ward: form.ward.value,
          village: form.village.value,
          physicalLocation: form.physicalLocation.value,
          latitude: form.latitude.value,
          longitude: form.longitude.value,
          contactPerson: form.contactPerson.value,
          phone: form.phone.value,
          email: form.email.value,
          notes: form.notes.value,
          tags: form.tags.value,
          locationIds: getMultipleSelectValues(byId('beneficiaryLocationSelect')),
          projectIds: getMultipleSelectValues(byId('beneficiaryProjectSelect')),
          distributedItems: collectDistributedItems('beneficiary'),
          customData: collectGenericCustomFieldData('beneficiary')
        });
        await uploadEntityMediaFiles('beneficiary', result.beneficiary, form);
        await refreshBootstrap();
        openEntity('beneficiary', result.beneficiary.id);
        form.reset();
        getFormField(form, 'id').value = '';
        setMultipleSelectValues(byId('beneficiaryLocationSelect'), []);
        setMultipleSelectValues(byId('beneficiaryProjectSelect'), []);
        resetDistributedItemsPanel('beneficiary');
        setFormCustomData('beneficiary', {});
        injectEntityCustomFields('beneficiary', {});
        renderFormIntelligence('beneficiary');
        showNotification('Beneficiary saved.', false);
      } catch (error) {
        showNotification(error.message, true);
      }
    });

    byId('beneficiaryFormReset').addEventListener('click', () => {
      byId('beneficiaryForm').reset();
      getFormField(byId('beneficiaryForm'), 'id').value = '';
      setMultipleSelectValues(byId('beneficiaryLocationSelect'), []);
      setMultipleSelectValues(byId('beneficiaryProjectSelect'), []);
      resetDistributedItemsPanel('beneficiary');
      setFormCustomData('beneficiary', {});
      injectEntityCustomFields('beneficiary', {});
      renderFormIntelligence('beneficiary');
    });

    bindAutoFilterForm('locationSearchForm', (event) => {
      event.preventDefault();
      setTablePage('locationsTable', 1);
      state.views.locations = filterLocationsLocally(Object.fromEntries(new FormData(event.currentTarget).entries()));
      renderLocations(state.views.locations);
    });

    byId('locationAddDistributedItemButton').addEventListener('click', () => {
      appendDistributedItemRow('location');
    });

    byId('locationForm').addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      try {
        const result = await callApi('saveLocation', {
          id: getFormField(form, 'id').value ? Number(getFormField(form, 'id').value) : null,
          name: form.name.value,
          locationType: form.locationType.value,
          county: form.county.value,
          subCounty: form.subCounty.value,
          ward: form.ward.value,
          village: form.village.value,
          latitude: form.latitude.value,
          longitude: form.longitude.value,
          physicalDescription: form.physicalDescription.value,
          notes: form.notes.value,
          tags: form.tags.value,
          distributedItems: collectDistributedItems('location'),
          customData: collectGenericCustomFieldData('location')
        });
        await uploadEntityMediaFiles('location', result.location, form);
        await refreshBootstrap();
        openEntity('location', result.location.id);
        form.reset();
        getFormField(form, 'id').value = '';
        resetDistributedItemsPanel('location');
        setFormCustomData('location', {});
        injectEntityCustomFields('location', {});
        renderFormIntelligence('location');
        showNotification('Location saved.', false);
      } catch (error) {
        showNotification(error.message, true);
      }
    });

    byId('locationFormReset').addEventListener('click', () => {
      byId('locationForm').reset();
      getFormField(byId('locationForm'), 'id').value = '';
      resetDistributedItemsPanel('location');
      setFormCustomData('location', {});
      injectEntityCustomFields('location', {});
      renderFormIntelligence('location');
    });

    byId('excelImportForm').addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const file = form.filePath.files[0];
      if (!file || !file.path) {
        showNotification('Please choose an Excel file to upload.', true);
        return;
      }
      try {
        const result = await window.environmentApp.uploadDocument({
          filePath: file.path,
          mimeType: file.type,
          relatedProjectId: form.relatedProjectId.value ? Number(form.relatedProjectId.value) : null,
          beneficiaryId: form.beneficiaryId.value ? Number(form.beneficiaryId.value) : null,
          locationId: form.locationId.value ? Number(form.locationId.value) : null,
          description: form.description.value,
          customData: collectGenericCustomFieldData('document')
        });
        if (!result.ok) {
          throw new Error(result.error);
        }
        state.selectedExcelImportId = result.data.excelImport ? result.data.excelImport.id : null;
        await refreshBootstrap();
        renderExcelConsole();
        bindExcelEditorSelects();
        form.reset();
        renderFormIntelligence('excel_import');
        showNotification('Excel workbook uploaded and extracted.', false);
      } catch (error) {
        showNotification(error.message, true);
      }
    });

    byId('documentForm').addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const files = getSelectedUploadFiles(form, 'filePath');
      if (!files.length) {
        showNotification('Please choose a file to upload.', true);
        return;
      }
      try {
        let lastResult = null;
        for (const file of files) {
          const result = await window.environmentApp.uploadDocument({
            filePath: file.path,
            mimeType: file.type,
            relatedProjectId: form.relatedProjectId.value ? Number(form.relatedProjectId.value) : null,
            beneficiaryId: form.beneficiaryId.value ? Number(form.beneficiaryId.value) : null,
            locationId: form.locationId.value ? Number(form.locationId.value) : null,
            activityId: form.activityId.value ? Number(form.activityId.value) : null,
            categoryId: form.categoryId.value ? Number(form.categoryId.value) : null,
            description: form.description.value,
            tags: form.tags.value,
            customData: collectGenericCustomFieldData('document')
          });
          if (!result.ok) {
            throw new Error(result.error);
          }
          lastResult = result;
        }
        state.selectedDocumentId = lastResult && lastResult.data && lastResult.data.document ? lastResult.data.document.id : null;
        await refreshBootstrap();
        renderDocumentDetail();
        form.reset();
        setFormCustomData('document', {});
        injectEntityCustomFields('document', {});
        renderFormIntelligence('document');
        showNotification(`${files.length} document${files.length === 1 ? '' : 's'} uploaded.`, false);
      } catch (error) {
        showNotification(error.message, true);
      }
    });

    bindAutoFilterForm('photoSearchForm', (event) => {
      event.preventDefault();
      setTablePage('photosGallery', 1);
      state.views.photos = filterPhotosLocally(Object.fromEntries(new FormData(event.currentTarget).entries()));
      renderPhotos(state.views.photos);
    });

    getFormField(byId('photoForm'), 'filePath').addEventListener('change', () => {
      renderPhotoUploadQueue(getSelectedUploadFiles(byId('photoForm'), 'filePath'));
    });

    byId('photoForm').addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const photoId = getFormField(form, 'id').value ? Number(getFormField(form, 'id').value) : null;
      const manageMode = getFormField(form, 'manageMode').value || 'create';
      const files = getSelectedUploadFiles(form, 'filePath');
      if (!photoId && (!files.length || !files[0].path)) {
        showNotification('Please choose one or more image files to upload.', true);
        return;
      }
      try {
        if (photoId) {
          const queuedPayloads = getQueuedPhotoPayloads(form);
          const photoPayload = queuedPayloads[0];
          if ((manageMode === 'replace' || (files.length && files[0].path)) && (!files.length || !files[0].path)) {
            throw new Error('Please choose the replacement image file before saving.');
          }
          if (files.length && files[0].path) {
            await callApi('replacePhotoFile', {
              photoId,
              filePath: files[0].path,
              mimeType: files[0].type
            });
          }
          await callApi('savePhoto', {
            id: photoId,
            title: photoPayload.title,
            category: photoPayload.category,
            photoDate: photoPayload.photoDate,
            description: photoPayload.description,
            projectId: form.projectId.value ? Number(form.projectId.value) : null,
            beneficiaryId: form.beneficiaryId.value ? Number(form.beneficiaryId.value) : null,
            locationId: form.locationId.value ? Number(form.locationId.value) : null,
            activityId: form.activityId.value ? Number(form.activityId.value) : null,
            tags: form.tags.value,
            customData: collectGenericCustomFieldData('photo')
          });
          await refreshBootstrap();
          resetPhotoForm();
          showNotification('Photo details saved.', false);
          return;
        }

        const queuedPayloads = getQueuedPhotoPayloads(form);
        for (const photoPayload of queuedPayloads) {
          await callApi('uploadPhoto', {
            ...photoPayload,
            projectId: form.projectId.value ? Number(form.projectId.value) : null,
            beneficiaryId: form.beneficiaryId.value ? Number(form.beneficiaryId.value) : null,
            locationId: form.locationId.value ? Number(form.locationId.value) : null,
            activityId: form.activityId.value ? Number(form.activityId.value) : null,
            tags: form.tags.value,
            customData: collectGenericCustomFieldData('photo')
          });
        }
        await refreshBootstrap();
        resetPhotoForm();
        showNotification(`${queuedPayloads.length} linked image${queuedPayloads.length === 1 ? '' : 's'} uploaded.`, false);
      } catch (error) {
        showNotification(error.message, true);
      }
    });

    byId('photoFormReset').addEventListener('click', () => {
      resetPhotoForm();
    });

    bindAutoFilterForm('mapSearchForm', (event) => {
      event.preventDefault();
      setTablePage('mapsGallery', 1);
      state.views.maps = filterMapsLocally(Object.fromEntries(new FormData(event.currentTarget).entries()));
      renderMaps(state.views.maps);
    });

    byId('mapForm').addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      let mapId = getFormField(form, 'id').value ? Number(getFormField(form, 'id').value) : null;
      if (mapId && !getMapById(mapId)) {
        getFormField(form, 'id').value = '';
        mapId = null;
      }
      const payload = {
        id: mapId,
        title: form.title.value,
        sourceType: form.sourceType.value,
        provider: form.provider.value,
        status: form.status.value,
        projectId: form.projectId.value ? Number(form.projectId.value) : null,
        beneficiaryId: form.beneficiaryId.value ? Number(form.beneficiaryId.value) : null,
        locationId: form.locationId.value ? Number(form.locationId.value) : null,
        activityId: form.activityId.value ? Number(form.activityId.value) : null,
        dutyId: form.dutyId.value ? Number(form.dutyId.value) : null,
        latitude: form.latitude.value,
        longitude: form.longitude.value,
        zoomLevel: form.zoomLevel.value,
        markerLabel: form.markerLabel.value,
        centreQuery: form.centreQuery.value,
        embedHtml: form.embedHtml.value,
        googleApiKey: form.googleApiKey.value,
        capturedAt: form.capturedAt.value,
        notes: form.notes.value,
        tags: form.tags.value,
        customData: collectGenericCustomFieldData('map')
      };
      const selectedFile = form.filePath.files && form.filePath.files[0];
      try {
        if (mapId) {
          await callApi('saveMap', payload);
          await refreshBootstrap();
          populateMapForm(getMapById(mapId));
          showNotification('Map details saved.', false);
          return;
        }
        if (payload.sourceType === 'google_static_api') {
          await callApi('captureStaticMap', payload);
          await refreshBootstrap();
          resetMapForm();
          showNotification('Google static map captured and linked.', false);
          return;
        }
        if (selectedFile && selectedFile.path) {
          await callApi('uploadMap', {
            ...payload,
            filePath: selectedFile.path,
            mimeType: selectedFile.type
          });
          await refreshBootstrap();
          resetMapForm();
          showNotification('Map image uploaded and linked.', false);
          return;
        }
        await callApi('saveMap', payload);
        await refreshBootstrap();
        resetMapForm();
        showNotification('Map reference saved.', false);
      } catch (error) {
        showNotification(error.message, true);
      }
    });

    byId('mapCaptureStaticButton').addEventListener('click', async () => {
      const form = byId('mapForm');
      if (getFormField(form, 'id').value) {
        showNotification('Static capture is only available for a new map record. Save changes or clear the form first.', true);
        return;
      }
      try {
        await callApi('captureStaticMap', {
          title: form.title.value,
          sourceType: 'google_static_api',
          provider: form.provider.value || 'google',
          status: form.status.value,
          projectId: form.projectId.value ? Number(form.projectId.value) : null,
          beneficiaryId: form.beneficiaryId.value ? Number(form.beneficiaryId.value) : null,
          locationId: form.locationId.value ? Number(form.locationId.value) : null,
          activityId: form.activityId.value ? Number(form.activityId.value) : null,
          dutyId: form.dutyId.value ? Number(form.dutyId.value) : null,
          latitude: form.latitude.value,
          longitude: form.longitude.value,
          zoomLevel: form.zoomLevel.value,
          markerLabel: form.markerLabel.value,
          centreQuery: form.centreQuery.value,
          googleApiKey: form.googleApiKey.value,
          capturedAt: form.capturedAt.value,
          notes: form.notes.value,
          tags: form.tags.value,
          customData: collectGenericCustomFieldData('map')
        });
        await refreshBootstrap();
        resetMapForm();
        showNotification('Google static map captured and linked.', false);
      } catch (error) {
        showNotification(error.message, true);
      }
    });

    byId('mapFormReset').addEventListener('click', () => {
      resetMapForm();
    });

    byId('mapSourceTypeSelect').addEventListener('change', () => {
      syncMapFormRequirements();
      renderFormIntelligence('map');
    });
    ['projectId', 'beneficiaryId', 'locationId'].forEach((fieldName) => {
      getFormField(byId('mapForm'), fieldName).addEventListener('change', () => {
        applySmartProjectContextToForm(byId('mapForm'), {
          projectField: 'projectId',
          beneficiaryField: 'beneficiaryId',
          locationField: 'locationId'
        });
        renderFormIntelligence('map');
      });
    });

    bindAutoFilterForm('activitySearchForm', (event) => {
      event.preventDefault();
      setTablePage('activitiesTable', 1);
      state.views.activities = filterActivitiesLocally(Object.fromEntries(new FormData(event.currentTarget).entries()));
      renderActivities(state.views.activities);
    });

    byId('activityForm').addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      try {
        const result = await callApi('saveActivity', {
          id: getFormField(form, 'id').value ? Number(getFormField(form, 'id').value) : null,
          title: form.title.value,
          activityType: form.activityType.value,
          activityDate: form.activityDate.value,
          status: form.status.value,
          projectId: form.projectId.value ? Number(form.projectId.value) : null,
          beneficiaryId: form.beneficiaryId.value ? Number(form.beneficiaryId.value) : null,
          locationId: form.locationId.value ? Number(form.locationId.value) : null,
          categoryId: form.categoryId.value ? Number(form.categoryId.value) : null,
          metricsJson: parseJsonField(form.metricsJson.value || '{}', {}),
          followUpStatus: form.followUpStatus.value,
          notes: form.notes.value,
          tags: form.tags.value,
          customData: collectGenericCustomFieldData('activity')
        });
        await uploadEntityMediaFiles('activity', result.activity, form);
        await refreshBootstrap();
        openEntity('activity', result.activity.id);
        form.reset();
        getFormField(form, 'id').value = '';
        getFormField(form, 'status').value = 'planned';
        getFormField(form, 'activityType').dataset.autoAssigned = 'false';
        setFormCustomData('activity', {});
        injectEntityCustomFields('activity', {});
        renderFormIntelligence('activity');
        showNotification('Activity saved.', false);
      } catch (error) {
        showNotification(error.message, true);
      }
    });

    getFormField(byId('activityForm'), 'activityType').addEventListener('change', (event) => {
      event.currentTarget.dataset.autoAssigned = 'false';
      renderFormIntelligence('activity');
    });

    byId('activityCategorySelect').addEventListener('change', () => {
      syncActivityTypeFromCategory(false);
      injectEntityCustomFields('activity', getFormCustomData('activity'));
    });

    byId('activityFormReset').addEventListener('click', () => {
      byId('activityForm').reset();
      getFormField(byId('activityForm'), 'id').value = '';
      getFormField(byId('activityForm'), 'status').value = 'planned';
      getFormField(byId('activityForm'), 'activityType').dataset.autoAssigned = 'false';
      setFormCustomData('activity', {});
      injectEntityCustomFields('activity', {});
      syncActivityTypeFromCategory(true);
      renderFormIntelligence('activity');
    });

    bindAutoFilterForm('dutySearchForm', (event) => {
      event.preventDefault();
      setTablePage('dutiesTable', 1);
      state.views.duties = filterDutiesLocally(Object.fromEntries(new FormData(event.currentTarget).entries()));
      renderDuties(state.views.duties);
    });

    byId('dutyForm').addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      await performAction(() => window.environmentApp.saveDuty({
        id: getFormField(form, 'id').value ? Number(getFormField(form, 'id').value) : null,
        title: form.title.value,
        dutyType: form.dutyType.value,
        assignedUserId: form.assignedUserId.value ? Number(form.assignedUserId.value) : null,
        assignedBeneficiaryId: form.assignedBeneficiaryId.value ? Number(form.assignedBeneficiaryId.value) : null,
        projectId: form.projectId.value ? Number(form.projectId.value) : null,
        locationId: form.locationId.value ? Number(form.locationId.value) : null,
        assignedDate: form.assignedDate.value,
        dueDate: form.dueDate.value,
        status: form.status.value,
        priority: form.priority.value,
        notes: form.notes.value,
        tags: form.tags.value,
        customData: collectGenericCustomFieldData('duty')
      }), 'Duty saved.');
      populateDutyForm(null);
      form.reset();
      getFormField(form, 'status').value = 'planned';
      getFormField(form, 'priority').value = 'normal';
      renderFormIntelligence('duty');
    });

    byId('dutyFormReset').addEventListener('click', () => {
      byId('dutyForm').reset();
      getFormField(byId('dutyForm'), 'id').value = '';
      getFormField(byId('dutyForm'), 'status').value = 'planned';
      getFormField(byId('dutyForm'), 'priority').value = 'normal';
      setFormCustomData('duty', {});
      injectEntityCustomFields('duty', {});
      renderFormIntelligence('duty');
    });
    ['projectId', 'assignedBeneficiaryId', 'locationId'].forEach((fieldName) => {
      getFormField(byId('dutyForm'), fieldName).addEventListener('change', () => {
        applySmartProjectContextToForm(byId('dutyForm'), {
          projectField: 'projectId',
          beneficiaryField: 'assignedBeneficiaryId',
          locationField: 'locationId'
        });
        renderFormIntelligence('duty');
      });
    });

    bindAutoFilterForm('timelineSearchForm', (event) => {
      event.preventDefault();
      setTablePage('timelineList', 1);
      state.views.timeline = filterTimelineLocally(Object.fromEntries(new FormData(event.currentTarget).entries()));
      renderTimeline(state.views.timeline);
    });

    byId('timelineForm').addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      await performAction(() => window.environmentApp.saveTimelineEntry({
        entryDate: form.entryDate.value,
        entryType: form.entryType.value,
        title: form.title.value,
        projectId: form.projectId.value ? Number(form.projectId.value) : null,
        beneficiaryId: form.beneficiaryId.value ? Number(form.beneficiaryId.value) : null,
        locationId: form.locationId.value ? Number(form.locationId.value) : null,
        activityId: form.activityId.value ? Number(form.activityId.value) : null,
        documentId: form.documentId.value ? Number(form.documentId.value) : null,
        photoId: form.photoId.value ? Number(form.photoId.value) : null,
        excelImportId: form.excelImportId.value ? Number(form.excelImportId.value) : null,
        description: form.description.value,
        customData: collectGenericCustomFieldData('timeline')
      }), 'Timeline note saved.');
      form.reset();
      setFormCustomData('timeline', {});
      injectEntityCustomFields('timeline', {});
      renderFormIntelligence('timeline');
    });

    bindAutoFilterForm('calendarSearchForm', (event) => {
      event.preventDefault();
      state.selectedCalendarDay = null;
      const filters = Object.fromEntries(new FormData(event.currentTarget).entries());
      state.views.calendar = filterCalendarEventsLocally(filters);
      setTablePage('calendarEventsTable', 1);
      renderCalendar(state.views.calendar);
    });

    byId('calendarResetFilters').addEventListener('click', () => {
      const form = byId('calendarSearchForm');
      form.reset();
      byId('calendarMonthInput').value = getCurrentMonthKey();
      state.selectedCalendarDay = null;
      state.views.calendar = filterCalendarEventsLocally({ monthKey: byId('calendarMonthInput').value });
      setTablePage('calendarEventsTable', 1);
      renderCalendar(state.views.calendar);
    });

    byId('calendarClearDayButton').addEventListener('click', () => {
      state.selectedCalendarDay = null;
      renderCalendar(state.views.calendar || deriveCalendarEvents());
    });

    byId('calendarDayBackToMonth').addEventListener('click', () => {
      state.selectedCalendarDay = null;
      renderCalendar(state.views.calendar || deriveCalendarEvents());
      switchSection('calendarSection', 'Calendar');
      byId('calendarGrid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    byId('dutyAssignmentBackButton').addEventListener('click', () => {
      switchSection('dutiesSection', 'Duties');
    });

    byId('dutyAssignmentEditButton').addEventListener('click', () => {
      const duty = getDutyById(Number(state.selectedDutyId || state.currentEntity?.id || 0));
      if (!duty) {
        return;
      }
      populateDutyForm(duty);
      switchSection('dutiesSection', 'Duties');
    });

    byId('calendarPreviousMonth').addEventListener('click', () => {
      const monthInput = byId('calendarMonthInput');
      monthInput.value = shiftMonthKey(monthInput.value || getCurrentMonthKey(), -1);
      state.selectedCalendarDay = null;
      state.views.calendar = filterCalendarEventsLocally(Object.fromEntries(new FormData(byId('calendarSearchForm')).entries()));
      setTablePage('calendarEventsTable', 1);
      renderCalendar(state.views.calendar);
    });

    byId('calendarNextMonth').addEventListener('click', () => {
      const monthInput = byId('calendarMonthInput');
      monthInput.value = shiftMonthKey(monthInput.value || getCurrentMonthKey(), 1);
      state.selectedCalendarDay = null;
      state.views.calendar = filterCalendarEventsLocally(Object.fromEntries(new FormData(byId('calendarSearchForm')).entries()));
      setTablePage('calendarEventsTable', 1);
      renderCalendar(state.views.calendar);
    });

    byId('reportForm').addEventListener('submit', async (event) => {
      event.preventDefault();
      try {
        await generateReport(new FormData(event.currentTarget));
        await refreshBootstrap();
      } catch (error) {
        showNotification(error.message, true);
      }
    });

    byId('printReportButton').addEventListener('click', async () => {
      try {
        await printCurrentSection();
      } catch (error) {
        showNotification(error.message, true);
      }
    });
    byId('exportProjectsButton').addEventListener('click', async () => {
      const data = await callApi('exportData', { type: 'projects' });
      showNotification(`Projects exported to ${data.exportPath}`, false);
    });
    byId('exportBeneficiariesButton').addEventListener('click', async () => {
      const data = await callApi('exportData', { type: 'beneficiaries' });
      showNotification(`Beneficiaries exported to ${data.exportPath}`, false);
    });
    byId('exportLocationsButton').addEventListener('click', async () => {
      const data = await callApi('exportData', { type: 'locations' });
      showNotification(`Locations exported to ${data.exportPath}`, false);
    });
    byId('exportEntriesButton').addEventListener('click', async () => {
      const data = await callApi('exportData', { type: 'entries' });
      showNotification(`Extracted data exported to ${data.exportPath}`, false);
    });

    byId('userForm').addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      await performAction(() => window.environmentApp.saveUser({
        id: getFormField(form, 'id').value ? Number(getFormField(form, 'id').value) : null,
        fullName: form.fullName.value,
        username: form.username.value,
        password: form.password.value,
        role: form.role.value,
        status: form.status.value
      }), 'User saved.');
      form.reset();
      getFormField(form, 'id').value = '';
    });

    byId('userFormReset').addEventListener('click', () => {
      byId('userForm').reset();
      getFormField(byId('userForm'), 'id').value = '';
    });

    byId('categoryForm').addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      await performAction(() => window.environmentApp.saveCategory({
        id: getFormField(form, 'id').value ? Number(getFormField(form, 'id').value) : null,
        name: form.name.value,
        description: form.description.value,
        customData: collectGenericCustomFieldData('category')
      }), 'Category saved.');
      resetCategoryForm();
    });

    byId('categoryFormReset').addEventListener('click', () => {
      resetCategoryForm();
    });

    byId('customFieldForm').addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const entityType = form.entityType.value || 'project';
      const entityConfig = getCustomFieldFormConfig(entityType);
      await performAction(() => window.environmentApp.saveCustomField({
        id: getFormField(form, 'id').value ? Number(getFormField(form, 'id').value) : null,
        entityType,
        categoryId: entityConfig && entityConfig.categoryFieldName && form.categoryId.value ? Number(form.categoryId.value) : null,
        fieldName: form.fieldName.value,
        fieldKey: form.fieldKey.value,
        fieldType: form.fieldType.value,
        insertAfterField: form.insertAfterField.value
      }), 'Custom field saved.');
      resetCustomFieldForm();
      renderAllEntityCustomFields();
    });

    byId('customFieldFormReset').addEventListener('click', () => {
      resetCustomFieldForm();
    });

    byId('brandingSettingsForm').addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const logoFile = form.logoFile.files[0];
      const iconFile = form.iconFile.files[0];
      try {
        await callApi('saveBrandingSettings', {
          organisationTitle: form.organisationTitle.value,
          appTitle: form.appTitle.value,
          appTagline: form.appTagline.value,
          mediaSectionLabel: form.mediaSectionLabel.value,
          logoFilePath: logoFile && logoFile.path ? logoFile.path : '',
          iconFilePath: iconFile && iconFile.path ? iconFile.path : ''
        });
        await refreshBootstrap();
        form.logoFile.value = '';
        form.iconFile.value = '';
        showNotification('Organisation branding saved. Restart the app to use the new window icon.', false);
      } catch (error) {
        showNotification(error.message, true);
      }
    });

    byId('loadDemoStoryButton').addEventListener('click', async () => {
      try {
        const data = await callApi('loadDemoStory');
        state.bootstrap = data.bootstrap;
        state.currentUser = data.bootstrap.currentUser;
        state.views = {
          projects: data.bootstrap.projects,
          beneficiaries: data.bootstrap.beneficiaries,
          locations: data.bootstrap.locations,
          photos: data.bootstrap.photos,
          activities: data.bootstrap.activities,
          timeline: data.bootstrap.timelineEntries
        };
        renderAll();
        showNotification(data.result.status === 'already_loaded' ? 'Demo relationship story is already loaded.' : 'Demo relationship story loaded.', false);
      } catch (error) {
        showNotification(error.message, true);
      }
    });

    byId('resetDemoStoryButton').addEventListener('click', async () => {
      try {
        const data = await callApi('resetDemoStory');
        state.bootstrap = data.bootstrap;
        state.currentUser = data.bootstrap.currentUser;
        state.views = {
          projects: data.bootstrap.projects,
          beneficiaries: data.bootstrap.beneficiaries,
          locations: data.bootstrap.locations,
          photos: data.bootstrap.photos,
          activities: data.bootstrap.activities,
          timeline: data.bootstrap.timelineEntries
        };
        renderAll();
        showNotification(data.result.status === 'empty' ? 'No demo relationship story was loaded.' : 'Demo relationship story removed.', false);
      } catch (error) {
        showNotification(error.message, true);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', async () => {
    console.log('Renderer bootstrap: DOMContentLoaded fired.');
    bindEvents();
    setupRepeatableUploadFields();
    renderPhotoUploadQueue([]);
    if (!hasElectronBridge()) {
      console.warn('Renderer bootstrap: Electron bridge missing, showing desktop launch state.');
      showDesktopLaunchState();
      return;
    }
    try {
      console.log('Renderer bootstrap: refreshing bootstrap payload.');
      await refreshBootstrap();
      console.log('Renderer bootstrap: switching to dashboard section.');
      switchSection('dashboardSection', 'Command Centre');
    } catch (error) {
      console.error('Renderer bootstrap failed.', error);
      showNotification(error.message, true);
    }
  });
}());
