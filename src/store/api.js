import axios from 'axios'

export const fetchLatest = () => {
    return axios.get('/latest')
}

export const fetchHistory = dtime => {
    return axios.get(`/day/${dtime}`)
}

export const fetchArticle = aid => {
    return axios.get(`/article/${aid}`)
}

export const fetchComment = aid => {
    return axios.get(`/article/${aid}/comments`)
}