const { Op } = require("sequelize");

async function errorRequest(res, error) {
    return res.status(500).json({ message: error.parent?.sqlMessage || error.message });
}



async function dateRangeSelection(query) {
    const rangeSearch = query?.start_date && query?.end_date ? {
        createdAt: {
            [Op.between]: [query?.start_date, query?.end_date]
        }
    } : {}
    return { rangeSearch }
}


async function pagination(query) {
    const { rangeSearch } = await dateRangeSelection(query)
    const page = query?.page ? Number(query?.page) || 1 : 0
    const limit = Number(query?.limit) || 50
    const offset = (page - 1) * limit
    return { page, limit, rangeSearch, offset, panginationSchema: { ...(query?.page ? { limit, offset } : {}) } }
}

async function metaData(data = [], page, count, limit, res) {
    if (page) {
        const totalPages = Math.ceil(count / limit)
        return {
            data, metaData: {
                count: data.length > 0 ? count : 0,
                currentPage: page,
                totalPages,
                limit
            },
            ...(res?.token ? { token: res.token } : {})
        }
    } else {
        return res?.token ? { data, token: res?.token } : data
    }

}

async function successResponseToken(data, res, message) {
    if (res?.token) {
        return { data, token: res?.token, message }
    } else {
        return { data, message }
    }
}
async function getColumnsKeys(ModelName, search) {
    if (!search) return []
    const columns = Object.keys(ModelName?.getAttributes());
    const searchConditions = []
    columns.forEach(column => {
        if (column !== "createdAt" && column !== "updatedAt" && column !== "deletedAt") {
            searchConditions.push({
                [column]: { [Op.like]: `%${search}%` },
            })
        }
    });
    return searchConditions
}


module.exports = { errorRequest, dateRangeSelection, getColumnsKeys, pagination, metaData, successResponseToken }