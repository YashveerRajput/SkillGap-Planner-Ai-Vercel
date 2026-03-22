import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
    withCredentials: true
})

export async function generateInterviewReportApi({ jobDescription, selfDescription, resume }) {
    const formData = new FormData()
    formData.append("jobDescription", jobDescription)
    formData.append("selfDescription", selfDescription)
    if (resume) formData.append("resume", resume)

    const response = await api.post("/api/interview/", formData)
    return response.data
}

export async function getInterviewReportByIdApi(interviewId) {
    const response = await api.get(`/api/interview/report/${interviewId}`)
    return response.data
}

export async function getAllInterviewReportsApi() {
    const response = await api.get("/api/interview/")
    return response.data
}

export async function getResumePdfApi(interviewReportId) {
    const response = await api.post(
        `/api/interview/resume/pdf/${interviewReportId}`,
        {},
        { responseType: "blob" }
    )
    return response.data
}
