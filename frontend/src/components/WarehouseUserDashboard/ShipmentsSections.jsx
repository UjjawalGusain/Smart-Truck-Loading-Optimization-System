const ShipmentsSection = ({
    shipments,
    filters,
    setFilters,
    page,
    setPage,
    totalPages
}) => {
    return (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow flex gap-4 flex-wrap">
                <select
                    value={filters.status}
                    onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
                    className="border rounded px-3 py-2"
                >
                    <option value="">All Status</option>
                    <option value="CREATED">CREATED</option>
                    <option value="PENDING">PENDING</option>
                    <option value="OPTIMIZED">OPTIMIZED</option>
                    <option value="BOOKED">BOOKED</option>
                    <option value="IN-TRANSIT">IN-TRANSIT</option>
                </select>

                <input
                    type="text"
                    placeholder="Destination"
                    value={filters.destination}
                    onChange={e => setFilters(f => ({ ...f, destination: e.target.value }))}
                    className="border rounded px-3 py-2"
                />

                <input
                    type="date"
                    value={filters.fromDate}
                    onChange={e => setFilters(f => ({ ...f, fromDate: e.target.value }))}
                    className="border rounded px-3 py-2"
                />

                <input
                    type="date"
                    value={filters.toDate}
                    onChange={e => setFilters(f => ({ ...f, toDate: e.target.value }))}
                    className="border rounded px-3 py-2"
                />

                <button
                    onClick={() => {
                        setFilters({
                            status: "",
                            destination: "",
                            fromDate: "",
                            toDate: ""
                        });
                        setPage(1);
                    }}
                    className="px-4 py-2 border rounded"
                >
                    Reset
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 text-sm text-gray-600">
                        <tr>
                            <th className="px-4 py-3">Destination</th>
                            <th className="px-4 py-3">Weight</th>
                            <th className="px-4 py-3">Volume</th>
                            <th className="px-4 py-3">Boxes</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Deadline</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shipments.map(s => (
                            <tr key={s._id} className="border-t">
                                <td className="px-4 py-3">{s.destination}</td>
                                <td className="px-4 py-3">{s.weightTons}</td>
                                <td className="px-4 py-3">{s.volumeM3}</td>
                                <td className="px-4 py-3">{s.numBoxes}</td>
                                <td className="px-4 py-3">{s.status}</td>
                                <td className="px-4 py-3">
                                    {new Date(s.deadline).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex justify-between items-center px-4 py-3 border-t">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="text-sm text-gray-600">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShipmentsSection;
