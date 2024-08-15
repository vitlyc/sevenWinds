import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import './TableRow.scss'
import TableCell from '../TableCell/TableCell'
import { useFocus } from '../../utils/useFocus'
import { Row, RowToRender } from '../../types'
import {
  useGetRowsQuery,
  updateQueryData,
  useCreateRowMutation,
  useDeleteRowMutation,
  useUpdateRowMutation,
} from '../../api'
import { AppDispatch } from '../../store'

type Props = {
  row: Row
  nested: number
  isRowCreated: boolean
  setIsRowCreated: (value: boolean) => void
}

const rowKeys: Array<keyof RowToRender> = [
  'rowName',
  'salary',
  'equipmentCosts',
  'overheads',
  'estimatedProfit',
]

const TableRow = ({ row, nested, isRowCreated, setIsRowCreated }: Props) => {
  const dispatch = useDispatch<AppDispatch>()
  const [isDisabled, setIsDisabled] = useState(row.id !== 112233)
  const [rowData, setRowData] = useState(row)
  const [shouldFocus, setShouldFocus] = useState(false)
  const [createRow] = useCreateRowMutation()
  const [deleteRow] = useDeleteRowMutation()
  const [updateRow] = useUpdateRowMutation()

  const inputRef = useFocus()
  const { data: cachedRows } = useGetRowsQuery()

  const newChildRow: Row = {
    id: 112233,
    parentId: row.id,
    rowName: 'empty name',
    salary: 0,
    equipmentCosts: 0,
    overheads: 0,
    estimatedProfit: 0,
    materials: 0,
    mimExploitation: 0,
    supportCosts: 0,
    mainCosts: 0,
    machineOperatorSalary: 0,
    child: [],
  }

  const handleAddEmptyRow = () => {
    if (!cachedRows || isRowCreated) return
    const findAndUpdateRow = (rows: Row[], targetId: number): boolean => {
      for (let r of rows) {
        if (r.id === targetId) {
          r.child = r.child || []
          r.child.push(newChildRow)
          return true
        }
        if (r.child && r.child.length > 0) {
          const found = findAndUpdateRow(r.child, targetId)
          if (found) return true
        }
      }
      return false
    }
    dispatch(
      updateQueryData('getRows', undefined, (draft) => {
        findAndUpdateRow(draft, row.id)
      })
    )
    setIsRowCreated(true)
  }

  const handleDeleteRow = async () => {
    const findAndDeleteRow = (rows: Row[], targetId: number): boolean => {
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].id === targetId) {
          rows.splice(i, 1) // Удаляем строку с указанным id
          return true
        }
        if (rows[i].child && rows[i].child.length > 0) {
          const found = findAndDeleteRow(rows[i].child, targetId)
          if (found) {
            return true
          }
        }
      }
      return false
    }

    if (row.id === 112233) {
      dispatch(
        updateQueryData('getRows', undefined, (draft) => {
          findAndDeleteRow(draft, row.id)
        })
      )
      setIsRowCreated(false)
    } else {
      try {
        await deleteRow(row.id).unwrap()
      } catch (error) {
        console.error('Failed to delete row:', error)
      }
    }
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && rowData.rowName.trim() !== '') {
      if (rowData.id === 112233) {
        try {
          const response = await createRow(rowData).unwrap()
          toggleDisabled()
          setIsRowCreated(false)
        } catch (error) {
          console.error('Ошибка при создании новой строки:', error)
        }
      } else if (rowData.id !== undefined) {
        try {
          await updateRow({ id: rowData.id, updatedRow: rowData }).unwrap()
          toggleDisabled()
          setIsRowCreated(false)
        } catch (error) {
          console.error('Ошибка при обновлении строки:', error)
        }
      }
    }
  }

  const handleChangeInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof RowToRender
  ) => {
    const value =
      key === 'rowName' ? e.target.value : parseFloat(e.target.value)
    setRowData((prevState) => ({
      ...prevState,
      [key]: value,
    }))
  }

  const toggleDisabled = () => {
    setIsDisabled((prevState) => !prevState)
    setShouldFocus((prevState) => !prevState)
  }

  useEffect(() => {
    setIsDisabled(row.id !== 112233)
  }, [row.id, row])

  useEffect(() => {
    if (shouldFocus && inputRef.current) {
      inputRef.current.focus()
      setShouldFocus(false)
    }
  }, [shouldFocus, inputRef])

  return (
    <tr
      className={`row ${row.id === 112233 ? 'new-row' : ''} no-select `}
      onDoubleClick={toggleDisabled}
    >
      <td>
        <TableCell
          nested={nested}
          onAddRow={handleAddEmptyRow}
          onDeleteRow={handleDeleteRow}
        />{' '}
      </td>
      {rowKeys.map((key) => (
        <td key={key}>
          <input
            ref={key === 'rowName' ? inputRef : null}
            type={key === 'rowName' ? 'text' : 'number'}
            value={rowData[key]}
            onChange={(e) => handleChangeInput(e, key)}
            disabled={isDisabled}
            onKeyDown={handleKeyDown}
          />
        </td>
      ))}
    </tr>
  )
}

export default TableRow
