class ModalHelper {
    async getModalTitle(modalElement) {
        const title = await modalElement.$('h4.not-margin');
        return (await title.getText()).trim();
    }
}

export default new ModalHelper();