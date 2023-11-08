import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import { Todo } from '../Todos/List'

test('testing the todo component', () => {
    const todo = { text: 'test text for a note',done:true}
    const onClickDelete = jest.fn()
    const onClickComplete = jest.fn()

    render(<Todo todo={todo} onClickDelete={onClickDelete} onClickComplete={onClickComplete}/>)
    const element = screen.queryByText(todo['text'])
    expect(element).toBeDefined()
    expect(element).toHaveTextContent(todo['text'])
})
