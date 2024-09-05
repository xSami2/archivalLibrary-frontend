import axios from 'axios';

export const ProductService = {

    getProductsData() {
        return [
            {
                uuid: "1",
                title: "title",
                author: "title",
                dataOfPublication: "title",
                description: "title",
            }
        ];
    },

    getProducts() {
        return Promise.resolve(this.getProductsByUserId());
    },

    async getProductsByUserId() {
        const user = JSON.parse(localStorage.getItem('user'));
        console.log(user.userId)

        try {
            const response = await axios.get(`http://localhost:9091/theArchivalLibrary/v1/file/${user.userId}`);
            console.log(response);
            return response.data;
        } catch (error) {
            console.error("Error fetching products:", error);
            throw error;  // Optionally rethrow the error for further handling
        }
    },
};
