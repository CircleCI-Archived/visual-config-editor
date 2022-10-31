describe('Components Mount', () => {
    it('Should have a title header', () => {
        const val = cy.get('body').get('#root').get('section')

        console.log(val)
    })
})