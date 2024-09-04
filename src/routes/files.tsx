import React, {useState, useEffect, useRef} from 'react';
import {classNames} from 'primereact/utils';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {ProductService} from '../service/ProductService';
import {Toast} from 'primereact/toast';
import {Button} from 'primereact/button';
import {FileUpload} from 'primereact/fileupload';
import {Toolbar} from 'primereact/toolbar';
import {InputTextarea} from 'primereact/inputtextarea';
import {IconField} from 'primereact/iconfield';
import {InputIcon} from 'primereact/inputicon';
import {Dialog} from 'primereact/dialog';
import {InputText} from 'primereact/inputtext';
import {Calendar} from 'primereact/calendar';


export default function ProductsDemo() {
    let document = {
        id: null,
        title: "",
        author: "",
        dataOfPublication: "",
        description: "",
    };

    const [date, setDate] = useState(null);
    const fileUploadReference = useRef(null);

    const [products, setProducts] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(document);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        ProductService.getProducts().then((data) => setProducts(data));
    }, []);


    const onSelect = (e) => {
        // e.files contains the list of selected files
        console.log('Selected files:', e.files);
    };

    const openNew = () => {
        setProduct(document);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);
        console.log(product);
        console.log(fileUploadReference)
        if (product.title.trim()) {
            let _products = [...products];
            let _product = {...product};

            if (product.id) {
                const index = findIndexById(product.id);

                _products[index] = _product;
                toast.current.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Updated',
                    life: 3000,
                });
            } else {
                _product.id = createId();
                _products.push(_product);
                toast.current.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Created',
                    life: 3000,
                });
            }

            setProducts(_products);
            setProductDialog(false);
            setProduct(document);
        }
    };

    const editProduct = (product) => {
        setProduct({...product});
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        let _products = products.filter((val) => val.id !== product.id);

        setProducts(_products);
        setDeleteProductDialog(false);
        setProduct(document);
        toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Product Deleted',
            life: 3000,
        });
    };

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = '';
        let chars =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return id;
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = () => {
        let _products = products.filter((val) => !selectedProducts.includes(val));

        setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Products Deleted',
            life: 3000,
        });
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = {...product};

        _product[`${name}`] = val;

        setProduct(_product);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _product = {...product};

        _product[`${name}`] = val;

        setProduct(_product);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button
                    label="New"
                    icon="pi pi-plus"
                    severity="success"
                    onClick={openNew}
                />
                <Button
                    label="Delete"
                    icon="pi pi-trash"
                    severity="danger"
                    onClick={confirmDeleteSelected}
                    disabled={!selectedProducts || !selectedProducts.length}
                />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <Button
                label="Export"
                icon="pi pi-upload"
                className="p-button-help"
                onClick={exportCSV}
            />
        );
    };


    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-pencil"
                    rounded
                    outlined
                    className="mr-2"
                    onClick={() => editProduct(rowData)}
                />
                <Button
                    icon="pi pi-arrow-down"
                    rounded
                    outlined
                    className="mr-2"
                    severity="danger"
                    onClick={() => confirmDeleteProduct(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    rounded
                    outlined
                    severity="danger"
                    onClick={() => confirmDeleteProduct(rowData)}
                />
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex  justify-between items-center  ">
            <h4 className="m-0">Manage Files</h4>
            <IconField iconPosition="right">
                <InputIcon className="pi pi-search"/>
                <InputText
                    type="search"
                    onInput={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search..."
                />
            </IconField>
        </div>
    );
    const productDialogFooter = (
        <React.Fragment>
            <Button className={"mr-3"} label="Cancel" icon="pi pi-times" outlined onClick={hideDialog}/>
            <Button label="Save" icon="pi pi-check" onClick={saveProduct}/>
        </React.Fragment>
    );
    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button
                label="No"
                icon="pi pi-times"
                outlined
                className={"mr-2"}
                onClick={hideDeleteProductDialog}
            />
            <Button
                label="Yes"
                icon="pi pi-check"
                severity="danger"
                onClick={deleteProduct}
            />
        </React.Fragment>
    );
    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button
                label="No"
                icon="pi pi-times"
                outlined
                onClick={hideDeleteProductsDialog}
            />
            <Button
                label="Yes"
                icon="pi pi-check"
                severity="danger"
                onClick={deleteSelectedProducts}
            />
        </React.Fragment>
    );

    return (
        <div>
            <Toast ref={toast}/>
            <div className="card">
                <Toolbar
                    className="mb-4"
                    left={leftToolbarTemplate}
                    right={rightToolbarTemplate}
                ></Toolbar>

                <DataTable
                    ref={dt}
                    value={products}
                    selection={selectedProducts}
                    onSelectionChange={(e) => setSelectedProducts(e.value)}
                    dataKey="id"
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                    globalFilter={globalFilter}
                    header={header}
                >
                    <Column selectionMode="multiple" exportable={false}></Column>
                    <Column
                        field="id"
                        header="ID"
                        sortable
                        style={{minWidth: '12rem'}}
                    ></Column>
                    <Column
                        field="title"
                        header="Title"
                        sortable
                        style={{minWidth: '16rem'}}
                    ></Column>
                    <Column
                        field="author"
                        header="Author"
                        sortable
                        style={{minWidth: '10rem'}}
                    ></Column>
                    <Column
                        field="dataOfPublication"
                        header="Data of Publication"
                        sortable
                        style={{minWidth: '10rem'}}
                    ></Column>
                    <Column
                        body={actionBodyTemplate}
                        exportable={false}
                        style={{minWidth: '12rem'}}
                    ></Column>
                </DataTable>
            </div>

            <Dialog
                visible={productDialog}
                style={{width: '32rem'}}
                breakpoints={{'960px': '75vw', '641px': '90vw'}}
                header="New Document"
                modal
                className="p-fluid"
                footer={productDialogFooter}
                onHide={hideDialog}
            >

                <div className="field">
                    <label htmlFor="title" className="font-bold">
                        Title
                    </label>
                    <InputText
                        id="name"
                        value={product.title}
                        onChange={(e) => onInputChange(e, 'title')}
                        required
                        autoFocus
                        className={classNames({'p-invalid': submitted && !product.title})}
                    />
                    {submitted && !product.title && (
                        <small className="p-error">Title is required.</small>
                    )}
                </div>

                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Author
                    </label>
                    <InputText
                        id="name"
                        value={product.author}
                        onChange={(e) => onInputChange(e, 'author')}
                        required
                        autoFocus
                        className={classNames({'p-invalid': submitted && !product.title})}
                    />
                    {submitted && !product.title && (
                        <small className="p-error">Author is required.</small>
                    )}
                </div>

                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Data of Publication
                    </label>
                    <Calendar value={date} onChange={(e) => setDate(e.value)} dateFormat="yy/mm/dd" showIcon={true}
                              required

                              className={classNames({'p-invalid': submitted && !product.title})}/>
                    {submitted && !product.title && (
                        <small className="p-error">Data Of Publication is required.</small>
                    )}
                </div>


                <div className="field">
                    <label htmlFor="description" className="font-bold">
                        Description
                    </label>
                    <InputTextarea
                        id="description"
                        value={product.description}
                        onChange={(e) => onInputChange(e, 'description')}
                        rows={3}
                        cols={20}
                        required
                        autoFocus
                        className={classNames({'p-invalid': submitted && !product.title})}
                    />
                    {submitted && !product.title && (
                        <small className="p-error">Description is required.</small>
                    )}

                </div>

                <div className={"mt-2"}>
                    <FileUpload chooseLabel={"Upload File"}  mode="basic"
                                onSelect={onSelect}
                                  accept="image/*" maxFileSize={1000000}/>
                </div>


            </Dialog>

            <Dialog
                visible={deleteProductDialog}
                style={{width: '32rem'}}
                breakpoints={{'960px': '75vw', '641px': '90vw'}}
                header="Confirm"
                modal
                footer={deleteProductDialogFooter}
                onHide={hideDeleteProductDialog}
            >
                <div className="confirmation-content">
                    <i
                        className="pi pi-exclamation-triangle mr-3"
                        style={{fontSize: '2rem'}}
                    />
                    {product && (
                        <span>
              Are you sure you want to delete <b>{product.title}</b>?
            </span>
                    )}
                </div>
            </Dialog>

            <Dialog
                visible={deleteProductsDialog}
                style={{width: '32rem'}}
                breakpoints={{'960px': '75vw', '641px': '90vw'}}
                header="Confirm"
                modal
                footer={deleteProductsDialogFooter}
                onHide={hideDeleteProductsDialog}
            >
                <div className="confirmation-content">
                    <i
                        className="pi pi-exclamation-triangle mr-3"
                        style={{fontSize: '2rem'}}
                    />
                    {product && (
                        <span>Are you sure you want to delete the selected products?</span>
                    )}
                </div>
            </Dialog>
        </div>
    );
}
