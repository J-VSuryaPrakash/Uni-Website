import type React from "react";
import { useRef } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	ArrowDown,
	ArrowUp,
	FileSpreadsheet,
	Plus,
	Trash2,
	X,
} from "lucide-react";

interface TableBlockEditorProps {
	heading: string;
	headers: string[];
	rows: string[][];
	onHeadingChange: (heading: string) => void;
	onHeadersChange: (headers: string[]) => void;
	onRowsChange: (rows: string[][]) => void;
}

export default function TableBlockEditor({
	heading,
	headers,
	rows,
	onHeadingChange,
	onHeadersChange,
	onRowsChange,
}: TableBlockEditorProps) {
	const csvInputRef = useRef<HTMLInputElement>(null);

	// ── Column operations ───────────────────────────────────────────────
	const addColumn = () => {
		const newHeaders = [...headers, `Column ${headers.length + 1}`];
		const newRows = rows.map((row) => [...row, ""]);
		onHeadersChange(newHeaders);
		onRowsChange(newRows);
	};

	const removeColumn = (colIndex: number) => {
		if (headers.length <= 1) {
			toast.error("Table must have at least one column");
			return;
		}
		const newHeaders = headers.filter((_, i) => i !== colIndex);
		const newRows = rows.map((row) => row.filter((_, i) => i !== colIndex));
		onHeadersChange(newHeaders);
		onRowsChange(newRows);
	};

	const updateHeader = (colIndex: number, value: string) => {
		const newHeaders = [...headers];
		newHeaders[colIndex] = value;
		onHeadersChange(newHeaders);
	};

	// ── Row operations ──────────────────────────────────────────────────
	const addRow = () => {
		onRowsChange([...rows, new Array(headers.length).fill("")]);
	};

	const removeRow = (rowIndex: number) => {
		onRowsChange(rows.filter((_, i) => i !== rowIndex));
	};

	const moveRow = (rowIndex: number, direction: "up" | "down") => {
		const target = direction === "up" ? rowIndex - 1 : rowIndex + 1;
		if (target < 0 || target >= rows.length) return;
		const newRows = [...rows];
		[newRows[rowIndex], newRows[target]] = [
			newRows[target],
			newRows[rowIndex],
		];
		onRowsChange(newRows);
	};

	const updateCell = (rowIndex: number, colIndex: number, value: string) => {
		const newRows = rows.map((row) => [...row]);
		newRows[rowIndex][colIndex] = value;
		onRowsChange(newRows);
	};

	// ── CSV import ──────────────────────────────────────────────────────
	const parseCSV = (text: string): string[][] => {
		const lines: string[][] = [];
		let current = "";
		let inQuotes = false;
		let row: string[] = [];

		for (let i = 0; i < text.length; i++) {
			const char = text[i];
			const next = text[i + 1];

			if (inQuotes) {
				if (char === '"' && next === '"') {
					current += '"';
					i++;
				} else if (char === '"') {
					inQuotes = false;
				} else {
					current += char;
				}
			} else {
				if (char === '"') {
					inQuotes = true;
				} else if (char === ",") {
					row.push(current.trim());
					current = "";
				} else if (char === "\n" || (char === "\r" && next === "\n")) {
					row.push(current.trim());
					if (row.some((cell) => cell !== "")) lines.push(row);
					row = [];
					current = "";
					if (char === "\r") i++;
				} else {
					current += char;
				}
			}
		}
		row.push(current.trim());
		if (row.some((cell) => cell !== "")) lines.push(row);

		return lines;
	};

	const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (!file.name.endsWith(".csv") && file.type !== "text/csv") {
			toast.error("Please upload a CSV file");
			return;
		}

		const reader = new FileReader();
		reader.onload = (event) => {
			const text = event.target?.result as string;
			if (!text) {
				toast.error("Could not read CSV file");
				return;
			}

			const parsed = parseCSV(text);
			if (parsed.length === 0) {
				toast.error("CSV file is empty");
				return;
			}

			const csvHeaders = parsed[0];
			const csvRows = parsed.slice(1);

			// Normalize row lengths to match header count
			const maxCols = csvHeaders.length;
			const normalizedRows = csvRows.map((row) => {
				const padded = [...row];
				while (padded.length < maxCols) padded.push("");
				return padded.slice(0, maxCols);
			});

			onHeadersChange(csvHeaders);
			onRowsChange(normalizedRows);
			toast.success(
				`Imported ${csvHeaders.length} columns and ${normalizedRows.length} rows`,
			);
		};
		reader.readAsText(file);

		if (csvInputRef.current) csvInputRef.current.value = "";
	};

	return (
		<div className="space-y-4">
			{/* Heading */}
			<div className="grid gap-1.5">
				<Label htmlFor="tableHeading">Table Heading (optional)</Label>
				<Input
					id="tableHeading"
					value={heading}
					onChange={(e) => onHeadingChange(e.target.value)}
					placeholder="e.g. Fee Structure 2025-26"
				/>
			</div>

			{/* CSV Import */}
			<div className="flex items-center gap-2">
				<input
					ref={csvInputRef}
					type="file"
					accept=".csv,text/csv"
					className="hidden"
					onChange={handleCSVUpload}
				/>
				<Button
					type="button"
					variant="outline"
					size="sm"
					className="gap-1.5"
					onClick={() => csvInputRef.current?.click()}
				>
					<FileSpreadsheet className="h-3.5 w-3.5" />
					Import CSV
				</Button>
				<span className="text-xs text-slate-400">
					First row will be used as column headers
				</span>
			</div>

			{/* Column Headers */}
			<div className="space-y-2">
				<div className="flex items-center justify-between">
					<Label>Columns ({headers.length})</Label>
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="gap-1 h-7 text-xs"
						onClick={addColumn}
					>
						<Plus className="h-3 w-3" />
						Add Column
					</Button>
				</div>
				<div className="flex flex-wrap gap-2">
					{headers.map((header, i) => (
						<div key={i} className="flex items-center gap-1">
							<Input
								value={header}
								onChange={(e) =>
									updateHeader(i, e.target.value)
								}
								placeholder={`Column ${i + 1}`}
								className="h-8 w-36 text-sm"
							/>
							<button
								type="button"
								onClick={() => removeColumn(i)}
								className="text-slate-400 hover:text-red-500 transition-colors p-0.5"
								title="Remove column"
							>
								<X className="h-3.5 w-3.5" />
							</button>
						</div>
					))}
				</div>
			</div>

			{/* Table Data */}
			{headers.length > 0 && (
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<Label>Rows ({rows.length})</Label>
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="gap-1 h-7 text-xs"
							onClick={addRow}
						>
							<Plus className="h-3 w-3" />
							Add Row
						</Button>
					</div>

					{rows.length > 0 ? (
						<div className="border border-slate-200 rounded-lg overflow-hidden">
							<div className="overflow-x-auto max-h-72 overflow-y-auto">
								<table className="w-full text-sm">
									<thead className="bg-slate-50 sticky top-0 z-10">
										<tr>
											<th className="px-2 py-2 text-left text-xs font-medium text-slate-500 w-8">
												#
											</th>
											{headers.map((h, i) => (
												<th
													key={i}
													className="px-2 py-2 text-left text-xs font-medium text-slate-600"
												>
													{h || `Col ${i + 1}`}
												</th>
											))}
											<th className="px-2 py-2 text-right text-xs font-medium text-slate-500 w-24">
												Actions
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-slate-100">
										{rows.map((row, ri) => (
											<tr
												key={ri}
												className="hover:bg-slate-50/50"
											>
												<td className="px-2 py-1 text-xs text-slate-400">
													{ri + 1}
												</td>
												{headers.map((_, ci) => (
													<td
														key={ci}
														className="px-1 py-1"
													>
														<Input
															value={
																row[ci] ?? ""
															}
															onChange={(e) =>
																updateCell(
																	ri,
																	ci,
																	e.target
																		.value,
																)
															}
															className="h-7 text-sm border-slate-200"
														/>
													</td>
												))}
												<td className="px-2 py-1">
													<div className="flex items-center justify-end gap-0.5">
														<button
															type="button"
															onClick={() =>
																moveRow(
																	ri,
																	"up",
																)
															}
															disabled={ri === 0}
															className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
															title="Move up"
														>
															<ArrowUp className="h-3.5 w-3.5" />
														</button>
														<button
															type="button"
															onClick={() =>
																moveRow(
																	ri,
																	"down",
																)
															}
															disabled={
																ri ===
																rows.length - 1
															}
															className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
															title="Move down"
														>
															<ArrowDown className="h-3.5 w-3.5" />
														</button>
														<button
															type="button"
															onClick={() =>
																removeRow(ri)
															}
															className="p-1 text-slate-400 hover:text-red-500 transition-colors"
															title="Delete row"
														>
															<Trash2 className="h-3.5 w-3.5" />
														</button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					) : (
						<div className="text-center py-6 text-sm text-slate-400 border border-dashed border-slate-200 rounded-lg">
							No rows yet. Click "Add Row" or import a CSV file.
						</div>
					)}
				</div>
			)}

			{headers.length === 0 && (
				<div className="text-center py-8 text-sm text-slate-400 border border-dashed border-slate-200 rounded-lg">
					Add columns manually or import a CSV file to get started.
				</div>
			)}
		</div>
	);
}
