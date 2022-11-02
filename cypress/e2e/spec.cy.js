describe('Components Mount', () => {
    it('Should have a title header', () => {
        cy.visit('http://127.0.0.1:5174/')

        const val = cy.get('#root > section > section').find('h1').then((h1) => {
            expect(h1.text()).equal('Visual Config Editor');
        });
    })
})