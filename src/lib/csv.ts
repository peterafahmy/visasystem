function parseLine(line: string) {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result.map((value) => value.trim());
}

export function parseCSV(input: string) {
  const lines = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) return [];
  const headers = parseLine(lines[0]).map((header, idx) => {
    if (idx === 0) {
      return header.replace(/^\uFEFF/, '').replace(/^\"?\uFEFF/, '').replace(/^\uFEFF\"?/, '');
    }
    return header;
  });
  return lines.slice(1).map((line) => {
    const values = parseLine(line);
    const row: Record<string, string> = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx] ?? '';
    });
    return row;
  });
}

export function toCSV(headers: string[], rows: Array<Record<string, string | number | null | undefined>>) {
  const escapeValue = (value: string) => {
    if (value.includes('"')) {
      value = value.replace(/"/g, '""');
    }
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value}"`;
    }
    return value;
  };

  const lines = [headers.join(',')];
  rows.forEach((row) => {
    const line = headers
      .map((header) => {
        const raw = row[header];
        const value = raw === null || raw === undefined ? '' : String(raw);
        return escapeValue(value);
      })
      .join(',');
    lines.push(line);
  });
  return lines.join('\n');
}
