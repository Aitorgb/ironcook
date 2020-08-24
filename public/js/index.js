const addIngredient = document.getElementById('newIngredient')
const divIngredients = document.getElementById('allIngredients')

const addSteps = document.getElementById('newSteps')
const divSteps = document.getElementById('allSteps')

if (addIngredient) {
    addIngredient.addEventListener('click', () => {
        const input = createdInput()
        input.setAttribute('name', 'ingredients')
        divIngredients.appendChild(input)
    })
} else if (addSteps) {
    addSteps.addEventListener('click', () => {
        const input = createdInput()
        input.setAttribute('name', 'steps')
        divSteps.appendChild(input)
    })
}





function createdInput() {
    const input = document.createElement('input')
    input.setAttribute('class', 'form-control mt-1')
    input.setAttribute('type', 'text')
    return input
}