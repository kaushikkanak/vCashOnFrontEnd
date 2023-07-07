import axios from "axios";

export const Baseurl = "http://3.110.222.235:3001/";
export const ImageUrl = "https://vcash.s3.ap-south-1.amazonaws.com/";

export const POST = async function (route, data, header = "") {
	try {
		if (header.headerStatus === true) {
			return await axios.post(Baseurl + route, data, {
				headers: {
					Authorization: "Bearer " + localStorage.getItem("token"),
				},
			});
		} else {
			return await axios.post(Baseurl + route, data);
		}
	} catch (err) {
		console.log(err);
	}
};

export const UPLOAD = async function (route, data, header = "") {
	try {
		if (header.headerStatus === true) {
			return await axios.post(Baseurl + route, data, {
				headers: {
					Authorization: "Bearer " + localStorage.getItem("token"),
					"Content-Type": "multipart/form-data",
				},
			});
		}
	} catch (err) {
		console.log(err);
	}
};

export const PUT = async function (route, data, header = "") {
	try {
		return await axios.put(Baseurl + route, data, {
			headers: {
				Authorization: "Bearer " + localStorage.getItem("token"),
			},
		});
	} catch (err) {
		console.log(err);
	}
};

export const DELETE = async function (route) {
	try {
		return await axios.delete(Baseurl + route, {
			headers: {
				Authorization: "Bearer " + localStorage.getItem("token"),
			},
		});
	} catch (err) {
		console.log(err);
	}
};

export const GET = async function (route) {
	try {
		return await axios.get(Baseurl + route, {
			headers: {
				Authorization: "Bearer " + localStorage.getItem("token"),
			},
		});
	} catch (err) {
		console.log(err);
	}
};
