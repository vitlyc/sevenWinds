import React, { useState } from 'react'
import './Table.scss'
import TableRow from '../TableRow/TableRow'
import { useGetRowsQuery } from '../../api'
import { Row } from '../../types'

export default function Table() {
  const { data: rows = [], isLoading, isError } = useGetRowsQuery()
  const [isRowCreated, setIsRowCreated] = useState(false)

  const renderRows = (rows: Row[], nested: number = 1) => {
    return rows.map((row) => (
      <React.Fragment key={row.id}>
        <TableRow
          key={row.id}
          row={row}
          nested={nested}
          isRowCreated={isRowCreated}
          setIsRowCreated={setIsRowCreated}
        />
        {row.child && row.child.length > 0 && renderRows(row.child, nested + 1)}
      </React.Fragment>
    ))
  }

  return (
    <div className="table no-select">
      <div className="title">
        <h4>Строительно-монтажные работы</h4>
      </div>
      <div className="table-section">
        <table>
          <thead>
            <tr>
              <th>Уровень</th>
              <th>Наименование работ</th>
              <th>Основная з/п</th>
              <th>Оборудование</th>
              <th>Накладные расходы</th>
              <th>Сметная прибыль</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6}>Loading...</td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={6}>Error loading data</td>
              </tr>
            )}
            {rows && renderRows(rows)}
          </tbody>
        </table>
      </div>
    </div>
  )
}
