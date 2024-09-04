export const ProductService = {
    getProductsData() {
        return [
            {
                id: "1",
                title: "title",
                author: "title",
                dataOfPublication: "title",
                description: "title",
            }
        ]
    },




    getProducts() {
        return Promise.resolve(this.getProductsData());
    },


};

