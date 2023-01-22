import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Products() {
    const { data, error, isLoading } = useSWR<{ name: string, id: number, code: string}[]>(
        '/api/mantainer/products',
        fetcher
    );

    if (isLoading) {
        return 'Cargando...'
    }

    return <div>
        <ul>
            { data ? data.map(item => <li key={item.id}>{item.name} - {item.code}</li>) : null}
        </ul>
    </div>
}