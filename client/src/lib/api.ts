import { apiRequest } from "./queryClient";

export const api = {
  // Auth
  login: (username: string, password: string) =>
    apiRequest("POST", "/api/auth/login", { username, password }),
  
  register: (userData: any) =>
    apiRequest("POST", "/api/auth/register", userData),

  // Users
  getUser: (id: string) =>
    apiRequest("GET", `/api/users/${id}`),

  // Children
  getChildrenByParent: (parentId: string) =>
    apiRequest("GET", `/api/children/parent/${parentId}`),
  
  createChild: (childData: any) =>
    apiRequest("POST", "/api/children", childData),
  
  updateChild: (id: string, updates: any) =>
    apiRequest("PUT", `/api/children/${id}`, updates),

  // Intake Forms
  getIntakeForm: (childId: string) =>
    apiRequest("GET", `/api/intake-forms/child/${childId}`),
  
  createIntakeForm: (formData: any) =>
    apiRequest("POST", "/api/intake-forms", formData),
  
  updateIntakeForm: (id: string, updates: any) =>
    apiRequest("PUT", `/api/intake-forms/${id}`, updates),

  // Clinics
  getAllClinics: () =>
    apiRequest("GET", "/api/clinics"),
  
  getClinicByUser: (userId: string) =>
    apiRequest("GET", `/api/clinics/user/${userId}`),

  // Sessions
  getSessionsByChild: (childId: string) =>
    apiRequest("GET", `/api/sessions/child/${childId}`),
  
  getSessionsByClinic: (clinicId: string) =>
    apiRequest("GET", `/api/sessions/clinic/${clinicId}`),
  
  getTodaysSessionsByClinic: (clinicId: string) =>
    apiRequest("GET", `/api/sessions/clinic/${clinicId}/today`),
  
  createSession: (sessionData: any) =>
    apiRequest("POST", "/api/sessions", sessionData),
  
  updateSession: (id: string, updates: any) =>
    apiRequest("PUT", `/api/sessions/${id}`, updates),

  // Claims
  getAllClaims: () =>
    apiRequest("GET", "/api/claims"),
  
  getPendingClaims: () =>
    apiRequest("GET", "/api/claims/pending"),
  
  getClaimsByChild: (childId: string) =>
    apiRequest("GET", `/api/claims/child/${childId}`),
  
  createClaim: (claimData: any) =>
    apiRequest("POST", "/api/claims", claimData),
  
  updateClaim: (id: string, updates: any) =>
    apiRequest("PUT", `/api/claims/${id}`, updates),

  // Documents
  getDocumentsByChild: (childId: string) =>
    apiRequest("GET", `/api/documents/child/${childId}`),
  
  createDocument: (documentData: any) =>
    apiRequest("POST", "/api/documents", documentData),
  
  deleteDocument: (id: string) =>
    apiRequest("DELETE", `/api/documents/${id}`),
};
