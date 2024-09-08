import React, {useState, useEffect, useRef} from 'react';
import {classNames} from 'primereact/utils';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {DocumentService} from '../service/DocumentService.jsx';
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
import axios from "axios";
import {useNavigate} from "react-router-dom";


export default function ProductsDemo() {

    const API_URL ="http://localhost:9091/theArchivalLibrary/v1";
    const user = JSON.parse(localStorage.getItem("user"))
    const navigate = useNavigate();
    const [date, setDate] = useState(null);
    const [tempDocument, setTempDocument] = useState({
        uuid: null,
        title: "",
        author: "",
        dataOfPublication: "",
        description: "",
        file: "",
    });
    const [documents, setDocuments] = useState([]);
    const [documentDialog, setDocumentDialog] = useState(false);
    const [deleteDocumentDialog, setDeleteDocumentDialog] = useState(false);
    const [newDocument, setNewDocument] = useState(tempDocument);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    let jwt = sessionStorage.getItem('token');
    jwt = jwt ? jwt.replace(/^"|"$/g, '') : '';

    useEffect(() => {
        DocumentService.getDocuments().then((data) => setDocuments(data));
    }, []);


    const openNew = () => {
        setNewDocument(tempDocument);
        setSubmitted(false);
        setDocumentDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setDocumentDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteDocumentDialog(false);
    };


    const saveDocuments = async () => {
        setSubmitted(true);
        const { title, author, dataOfPublication, description, file } = newDocument;
        if (title.trim() && author.trim() && dataOfPublication.trim() && description.trim() && file) {
            let _documents = [...documents];


            const BOB = await fetch(newDocument.file.objectURL);
            const blob = await BOB.blob();
            const fileName = newDocument.file.name;  // Specify the file name you want
            const file = new File([blob], fileName, {type: blob.type});

            const formData = new FormData();
            formData.append("file", file); // Assuming 'fileInput' is an input element of type 'file'
            formData.append('title', newDocument.title);
            formData.append('author', newDocument.author);
            formData.append('dataOfPublication', newDocument.dataOfPublication);
            formData.append('description', newDocument.description);
            formData.append('userId', user.userId);


            const response = await axios.post(`${API_URL}/file`, formData, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                const data = response.data;
                _documents.push(data);
                toast.current.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Document Created',
                    life: 3000,
                });
                setDocuments(_documents);
                setDocumentDialog(false);
                setNewDocument(tempDocument);

            } else {
                toast.current.show({
                    severity: 'warn',
                    summary: 'unSuccessful',
                    detail: 'Failed to Create Document',
                    life: 3000,
                });
            }


        }




    };


    const confirmDeleteProduct = (product) => {
        setNewDocument(product);
        setDeleteDocumentDialog(true);
    };

    const downloadDocument = async (product) => {
        try {


            const response = await axios.get(  `${API_URL}/file/download`, {
                params: {path: product.filePath},
                responseType: 'blob',
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                }
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', product.fileName);  // Extract the file name from the path
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
        }

    };

    const deleteProduct = async () => {


        const res = await axios.delete(  `${API_URL}/file`, {
            data: newDocument,
            headers: {
                'Authorization': `Bearer ${jwt}`,
            }
        })

        if (res.status === 200) {
            let _products = documents.filter((val) => val.uuid !== newDocument.uuid);
            setDocuments(_products);
            setNewDocument(tempDocument);
            toast.current.show({
                severity: 'success',
                summary: 'Successful',
                detail: 'Document Deleted',
                life: 3000,
            });
        } else {
            toast.current.show({
                severity: 'danger',
                summary: 'Error',
                detail: "Can't Delete File",
                life: 3000,
            });
        }

        setDeleteDocumentDialog(false);

    };


    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const logoutUser = () => {
        sessionStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/', {replace: true});

    }


    const onInputChange = (e, name) => {
        let updatedDocument = {...newDocument};

        switch (name) {
            case "file":
                if (e.files && e.files[0]) {
                    updatedDocument.file = e.files[0];
                }
                break;
            case "dataOfPublication":
                const formattedDate = formatDate(e.value);
                updatedDocument.dataOfPublication = formattedDate;
                break;
            default:
                // @ts-ignore
                updatedDocument[name] = e.target?.value || '';
                break;
        }

        setNewDocument(updatedDocument);
    };


    const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        return `${year}/${month}/${day}`;
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
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <div>

                <Button
                    label="Export"
                    icon="pi pi-upload"
                    className="p-button-help mr-2"
                    onClick={exportCSV}
                />

                <Button label="Logout" onClick={logoutUser} icon="pi pi-check"/>

            </div>

        );
    };


    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-arrow-down"
                    rounded
                    outlined
                    className="mr-2"
                    severity="danger"
                    onClick={() => downloadDocument(rowData)}
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
            <h4 className="m-0">Manage Documents</h4>
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
            <Button label="Save" icon="pi pi-check" onClick={saveDocuments}/>
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


    return (
        <div>
            <Toast ref={toast}/>
            <div className="card h-screen">
                <Toolbar
                    className="mb-4"
                    left={leftToolbarTemplate}
                    right={rightToolbarTemplate}
                ></Toolbar>

                <DataTable
                    ref={dt}
                    value={documents}
                    dataKey="uuid"
                    style={{Height: '95vh'}}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                    globalFilter={globalFilter}
                    header={header}
                >

                    <Column
                        field="title"
                        header="Title"
                        sortable
                        style={{minWidth: '8rem'}}
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
                        style={{minWidth: '4rem'}}
                    ></Column>
                    <Column
                        field="description"
                        header="Description"
                        sortable
                        style={{minWidth: '30rem'}}
                    ></Column>
                    <Column
                        body={actionBodyTemplate}
                        exportable={false}
                        style={{minWidth: '9rem'}}
                    ></Column>
                </DataTable>
            </div>

            <Dialog
                visible={documentDialog}
                style={{width: '32rem'}}
                breakpoints={{'960px': '75vw', '641px': '90vw'}}
                header={"New Document"}
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
                        value={newDocument.title}
                        onChange={(e) => onInputChange(e, 'title')}
                        required
                        autoFocus
                        className={classNames({'p-invalid': submitted && !newDocument.title})}
                    />
                    {submitted && !newDocument.title && (
                        <small className="p-error">Title is required.</small>
                    )}
                </div>

                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Author
                    </label>
                    <InputText
                        id="name"
                        value={newDocument.author}
                        onChange={(e) => onInputChange(e, 'author')}
                        required
                        autoFocus
                        className={classNames({'p-invalid': submitted && !newDocument.author})}
                    />
                    {submitted && !newDocument.author && (
                        <small className="p-error">Author is required.</small>
                    )}
                </div>

                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Data of Publication
                    </label>
                    <Calendar value={date}
                              onChange={(e) => onInputChange(e, 'dataOfPublication')} dateFormat="yy/mm/dd"
                              showIcon={true}
                              required

                              className={classNames({'p-invalid': submitted && !newDocument.dataOfPublication})}/>
                    {submitted && !newDocument.dataOfPublication && (
                        <small className="p-error">Data Of Publication is required.</small>
                    )}
                </div>


                <div className="field">
                    <label htmlFor="description" className="font-bold">
                        Description
                    </label>
                    <InputTextarea
                        id="description"
                        value={newDocument.description}
                        onChange={(e) => onInputChange(e, 'description')}
                        rows={3}
                        cols={20}
                        required
                        autoFocus
                        className={classNames({'p-invalid': submitted && !newDocument.description})}
                    />
                    {submitted && !newDocument.description && (
                        <small className="p-error">Description is required.</small>
                    )}

                </div>


                <div className="mt-2">
                    <FileUpload
                        chooseLabel={"Upload File"}
                        mode="basic"
                        onSelect={(e) => onInputChange(e, 'file')}
                        className={classNames({'p-invalid': submitted && !newDocument.file})}
                        maxFileSize={1000000}
                    />
                    {submitted && !newDocument.file && (
                        <small className="p-error">File is required.</small>
                    )}
                </div>


            </Dialog>

            <Dialog
                visible={deleteDocumentDialog}
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
                    {newDocument && (
                        <span>
              Are you sure you want to delete <b>{newDocument.title}</b>?
            </span>
                    )}
                </div>
            </Dialog>


        </div>
    );
}
