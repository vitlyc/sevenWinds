import './TableCell.scss'
import FeedIcon from '@mui/icons-material/Feed'
import DeleteIcon from '@mui/icons-material/Delete'
import { useState } from 'react'

type Props = {
  nested: number
  onAddRow: () => void
  onDeleteRow: () => void
}

function TableCell({ nested, onAddRow, onDeleteRow }: Props) {
  const [visibleDelete, setVisibleDelete] = useState(false)

  const onMouseOver: React.MouseEventHandler<HTMLDivElement> = () => {
    setVisibleDelete(true)
  }

  const onMouseOut: React.MouseEventHandler<HTMLDivElement> = () => {
    setVisibleDelete(false)
  }

  return (
    <div
      data-nested={nested}
      className="cell"
      style={{ marginLeft: `${nested * 20}px` }}
    >
      <div
        className={`container ${
          visibleDelete ? '' : 'transparent'
        } nested-${nested}`}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
      >
        <FeedIcon
          className="icon edit"
          sx={{ color: '#7890B2' }}
          onClick={onAddRow}
        />
        {visibleDelete && (
          <DeleteIcon
            className="icon delete"
            sx={{ color: '#DF4444' }}
            style={{ display: visibleDelete ? 'block' : 'none' }}
            onClick={onDeleteRow}
          />
        )}
      </div>
    </div>
  )
}

export default TableCell
