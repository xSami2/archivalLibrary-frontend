import axios from 'axios';

let jwt = sessionStorage.getItem('token');
const API_URL = "http://localhost:9091/theArchivalLibrary/v1";
jwt = jwt ? jwt.replace(/^"|"$/g, '') : '';
export const DocumentService = {




    getDocuments() {
        return Promise.resolve(this.getDocumentsByUserId());
    },

    async getDocumentsByUserId() {
        const user = JSON.parse(localStorage.getItem('user'));
        try {
            const response = await axios.get(`${API_URL}/file/${user.userId}` ,{
               headers: {
                   'Authorization': `Bearer ${jwt}`,
               }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
