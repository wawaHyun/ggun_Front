
export async function uploadFiles(files: any): Promise<any | { status: number }> {
    try {
        const formData = new FormData();

        if (Array.isArray(files)) {
            files.forEach((file, index) => {
                formData.append(`file${index}`, file);
            });
        } else {
            formData.append('file', files); // 단일 파일일 경우
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/alarms/fileRecord/uploadFiles`, {
            method: 'POST',
            headers: { 'Content-type': 'multipart/form-data',},
            body: formData,
        })
        if (!response.ok) { throw new Error('API Network response was not ok'); }
        // const data: any = await response.json();
        // if (data == null) { return { status: 404 }; }
        // console.log("uploadFiles api : " + JSON.stringify(data))
        return response
    } catch (error) {
        console.error("uploadFiles err : " + error);
        return { status: 500 };
    }
}
