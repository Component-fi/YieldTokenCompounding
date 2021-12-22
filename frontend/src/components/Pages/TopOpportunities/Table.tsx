import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, chakra } from '@chakra-ui/react';
import { useTable, useSortBy, Column } from 'react-table';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { SimulationResult } from 'api/ytc/simulateTranches';

interface Props {
    data: SimulationResult[]
}

export const DataTable: React.FC<Props> = (props) => {
    const { data } = props;

    const columns = React.useMemo(
        () => [
            {
                header: "Token",
                accessor: "tokenName"
            } as Column<SimulationResult>,
            {
                header: "Expiry",
                accessor: "expiry"
            } as Column<SimulationResult>,
            {
                header: "Tranche Address",
                accessor: "trancheAddress"
            } as Column<SimulationResult>,
            {
                header: "APR",
                accessor: "apr"
            } as Column<SimulationResult>,
            {
                header: "Net Gain",
                accessor: "netGain"
            } as Column<SimulationResult>,
            {
                header: "ROI",
                accessor: "roi"
            } as Column<SimulationResult>,
        ],
        []
    )

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
        {
          data,
          columns,
        },
        useSortBy
      )


    return <Table {...getTableProps()}>
        <Thead>
            {headerGroups.map((headerGroup) => (
                <Tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column: any) => (
                        <Th
                            {...column.getHeaderProps(column.getSortByToggleProps())}
                            isNumeric={column.isNumeric}
                        >
                            {column.render('Header')}
                            <chakra.span pl='4'>
                                {column.isSorted ? (
                                    column.isSortedDesc ? (
                                        <TriangleDownIcon aria-label='sorted descending'/>
                                    ) : (
                                        <TriangleUpIcon aria-label='sorted ascending'/>
                                    )
                                ) : null}
                            </chakra.span>
                        </Th>
                    ))}
                </Tr>
            ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
            {rows.map((row) => {
                prepareRow(row)
                return (
                    <Tr {...row.getRowProps()}>
                        {row.cells.map((cell: any) => (
                            <Td {...cell.getCellProps()} isNumeric={cell.column.isNumeric}>
                                {cell.render('Cell')}
                            </Td>
                        ))}
                    </Tr>
                )
            })}
        </Tbody>
    </Table>
}