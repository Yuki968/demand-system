import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parents[1] / "dev.db"
CREATED_AT = "2026-04-07"
CREATED_BY = "\u6279\u91cf\u5bfc\u5165"

TYPE_MAP = {
    "\u5ba2\u6237\u5b9a\u5236\u9700\u6c42": "CUSTOMER_CUSTOMIZATION",
    "\u4ea7\u54c1\u8fed\u4ee3\u9700\u6c42": "PRODUCT_ITERATION",
}

PRIORITY_MAP = {
    "\u6781\u9ad8": "VERY_HIGH",
    "\u9ad8": "HIGH",
    "\u4e2d": "MEDIUM",
}

STATUS_MAP = {
    ("\u8fdb\u884c\u4e2d", "\u4ea7\u54c1\u627f\u63a5"): "PRODUCT_INTAKE",
    ("\u8fdb\u884c\u4e2d", "\u4ea4\u4ed8\u9a8c\u6536"): "IMPLEMENTATION_DELIVERY",
    ("\u5df2\u7ed3\u675f", "\u4ea4\u4ed8\u9a8c\u6536"): "CLOSED",
}

STAGE_SEQUENCE = [
    "DEMAND_CREATED",
    "PRODUCT_INTAKE",
    "IMPLEMENTATION_DELIVERY",
]

DATA = [
    {"name": "\u6fb3\u65b0\u9694\u70ed\u57ab\u9700\u6c42", "type": "\u5ba2\u6237\u5b9a\u5236\u9700\u6c42", "status": "\u8fdb\u884c\u4e2d", "stage": "\u4ea7\u54c1\u627f\u63a5", "basis": "\u6267\u884c\u53cd\u9988\u663e\u793a\u201c\u8bbe\u8ba1\u5bfb\u6e90\u4e2d\u2026\u201d\uff0c\u5df2\u8fdb\u5165\u627f\u63a5", "planned": "2025-12-19", "priority": "\u9ad8"},
    {"name": "\u5ba2\u5bb6\u672c\u8272\u62bd\u5c49\u5e95\u5ea7\u4e0e\u811a\u8f6e\u66f4\u6539\u9700\u6c42", "type": "\u5ba2\u6237\u5b9a\u5236\u9700\u6c42", "status": "\u5df2\u7ed3\u675f", "stage": "\u4ea4\u4ed8\u9a8c\u6536", "basis": "\u8868\u683c\u72b6\u6001\u4e3a\u5df2\u7ed3\u675f\uff0c\u5148\u6309\u5b8c\u6210\u6001\u5f55\u5165", "planned": "", "priority": "\u4e2d"},
    {"name": "\u957f\u6c99\u5927\u7897\u5148\u751f\u964d\u4f4e\u6dae\u9505\u65f6\u95f4", "type": "\u5ba2\u6237\u5b9a\u5236\u9700\u6c42", "status": "\u5df2\u7ed3\u675f", "stage": "\u4ea4\u4ed8\u9a8c\u6536", "basis": "\u8868\u683c\u72b6\u6001\u4e3a\u5df2\u7ed3\u675f", "planned": "2025-12-31", "priority": "\u4e2d"},
    {"name": "\u6734\u6734\u6811\u8102\u9505\u5237\u9700\u6c42", "type": "\u5ba2\u6237\u5b9a\u5236\u9700\u6c42", "status": "\u8fdb\u884c\u4e2d", "stage": "\u4ea4\u4ed8\u9a8c\u6536", "basis": "\u8868\u683c\u72b6\u6001\u4e3a\u5df2\u8f6c\u4ea4", "planned": "2025-12-31", "priority": "\u9ad8"},
    {"name": "\u7eafK\u7cbe\u5ea6\u63d0\u5347", "type": "\u5ba2\u6237\u5b9a\u5236\u9700\u6c42", "status": "\u8fdb\u884c\u4e2d", "stage": "\u4ea4\u4ed8\u9a8c\u6536", "basis": "\u8868\u683c\u72b6\u6001\u4e3a\u5df2\u8f6c\u4ea4", "planned": "2025-12-31", "priority": "\u9ad8"},
    {"name": "\u5927\u7897\u5148\u751f\u869d\u6cb9\u63d0\u5347", "type": "\u5ba2\u6237\u5b9a\u5236\u9700\u6c42", "status": "\u8fdb\u884c\u4e2d", "stage": "\u4ea4\u4ed8\u9a8c\u6536", "basis": "\u8868\u683c\u72b6\u6001\u770b\u8d77\u6765\u4e3a\u5df2\u8f6c\u4ea4\uff0c\u5148\u6309\u4ea4\u4ed8\u9a8c\u6536\u5f55\u5165", "planned": "", "priority": "\u9ad8"},
    {"name": "2.0\u964d\u672c Omni&Max", "type": "\u5ba2\u6237\u5b9a\u5236\u9700\u6c42", "status": "\u8fdb\u884c\u4e2d", "stage": "\u4ea7\u54c1\u627f\u63a5", "basis": "\u8868\u683c\u72b6\u6001\u4e3a\u8fdb\u884c\u4e2d\uff0c\u5c5e\u4e8e\u6539\u578b/\u964d\u672c\u63a8\u8fdb\u4e2d", "planned": "2026-04-13", "priority": "\u9ad8"},
    {"name": "\u7f8e\u56fd grill \u9505\u6539\u9020", "type": "\u5ba2\u6237\u5b9a\u5236\u9700\u6c42", "status": "\u8fdb\u884c\u4e2d", "stage": "\u4ea7\u54c1\u627f\u63a5", "basis": "\u8868\u683c\u72b6\u6001\u4e3a\u8fdb\u884c\u4e2d", "planned": "2026-03-31", "priority": "\u9ad8"},
    {"name": "\u65e5\u672c\u5b9a\u5236\u5e95\u5ea7", "type": "\u5ba2\u6237\u5b9a\u5236\u9700\u6c42", "status": "\u8fdb\u884c\u4e2d", "stage": "\u4ea7\u54c1\u627f\u63a5", "basis": "\u8868\u683c\u72b6\u6001\u4e3a\u8fdb\u884c\u4e2d", "planned": "2026-03-31", "priority": "\u9ad8"},
    {"name": "\u673a\u82af\u78c1\u73af\u4e0e\u7ebf\u76d8\u7ebf\u5708\u635f\u4f24\u3001\u7535\u673a\u52a8\u529b\u7ebf\u78e8\u635f\u95ee\u9898", "type": "\u4ea7\u54c1\u8fed\u4ee3\u9700\u6c42", "status": "\u8fdb\u884c\u4e2d", "stage": "\u4ea4\u4ed8\u9a8c\u6536", "basis": "\u8868\u683c\u72b6\u6001\u4e3a\u5df2\u8f6c\u4ea4", "planned": "2025-12-31", "priority": "\u6781\u9ad8"},
    {"name": "\u4e0d\u6295\u6c34\u3001\u6f0f\u6c34\u3001\u6d17\u9505\u6c34\u5c0f\u95ee\u9898\u6cbb\u7406", "type": "\u4ea7\u54c1\u8fed\u4ee3\u9700\u6c42", "status": "\u8fdb\u884c\u4e2d", "stage": "\u4ea4\u4ed8\u9a8c\u6536", "basis": "\u8868\u683c\u72b6\u6001\u4e3a\u5df2\u8f6c\u4ea4", "planned": "2025-12-31", "priority": "\u6781\u9ad8"},
    {"name": "\u6c34\u67aa\u6613\u635f\u95ee\u9898\u4f18\u5316", "type": "\u4ea7\u54c1\u8fed\u4ee3\u9700\u6c42", "status": "\u8fdb\u884c\u4e2d", "stage": "\u4ea7\u54c1\u627f\u63a5", "basis": "\u8868\u683c\u72b6\u6001\u4e3a\u8fdb\u884c\u4e2d", "planned": "2025-12-18", "priority": "\u6781\u9ad8"},
    {"name": "\u8815\u52a8\u6cf5\u7ba1\u7834\u7ba1\u98ce\u9669\u4f18\u5316", "type": "\u4ea7\u54c1\u8fed\u4ee3\u9700\u6c42", "status": "\u8fdb\u884c\u4e2d", "stage": "\u4ea4\u4ed8\u9a8c\u6536", "basis": "\u8868\u683c\u72b6\u6001\u4e3a\u5df2\u8f6c\u4ea4", "planned": "2025-12-19", "priority": "\u6781\u9ad8"},
    {"name": "\u6c34\u6dc0\u7c89\u7ba1\u8def\u6e05\u6d17\u6b7b\u89d2\u4f18\u5316", "type": "\u4ea7\u54c1\u8fed\u4ee3\u9700\u6c42", "status": "\u8fdb\u884c\u4e2d", "stage": "\u4ea4\u4ed8\u9a8c\u6536", "basis": "\u8868\u683c\u72b6\u6001\u4e3a\u5df2\u8f6c\u4ea4", "planned": "2025-12-19", "priority": "\u9ad8"},
    {"name": "\u6574\u673a\u9632\u6c34\u4f18\u5316", "type": "\u4ea7\u54c1\u8fed\u4ee3\u9700\u6c42", "status": "\u5df2\u7ed3\u675f", "stage": "\u4ea4\u4ed8\u9a8c\u6536", "basis": "\u8868\u683c\u72b6\u6001\u4e3a\u5df2\u7ed3\u675f", "planned": "2025-12-31", "priority": "\u4e2d"},
    {"name": "\u8f6c\u9505\u5f02\u54cd\u4e0e\u503e\u9505\u5f02\u54cd\u95ee\u9898\u4f18\u5316", "type": "\u4ea7\u54c1\u8fed\u4ee3\u9700\u6c42", "status": "\u5df2\u7ed3\u675f", "stage": "\u4ea4\u4ed8\u9a8c\u6536", "basis": "\u8868\u683c\u72b6\u6001\u4e3a\u5df2\u7ed3\u675f", "planned": "2025-12-31", "priority": "\u4e2d"},
    {"name": "2.0\u5e72\u6599\u7535\u673a\u9f7f\u8f6e\u65ad\u88c2\u95ee\u9898\u4f18\u5316", "type": "\u4ea7\u54c1\u8fed\u4ee3\u9700\u6c42", "status": "\u8fdb\u884c\u4e2d", "stage": "\u4ea4\u4ed8\u9a8c\u6536", "basis": "\u8868\u683c\u72b6\u6001\u4e3a\u5df2\u8f6c\u4ea4", "planned": "2025-12-31", "priority": "\u6781\u9ad8"},
    {"name": "\u732a\u6cb9\u6876NTC\u6298\u65ad\u5bfc\u81f4\u6e29\u5ea6\u8bfb\u53d6\u5f02\u5e38\u95ee\u9898\u4f18\u5316", "type": "\u4ea7\u54c1\u8fed\u4ee3\u9700\u6c42", "status": "\u5df2\u7ed3\u675f", "stage": "\u4ea4\u4ed8\u9a8c\u6536", "basis": "\u8868\u683c\u72b6\u6001\u4e3a\u5df2\u7ed3\u675f", "planned": "2026-01-14", "priority": "\u9ad8"},
    {"name": "\u5c4f\u5e55\u4e13\u9879", "type": "\u4ea7\u54c1\u8fed\u4ee3\u9700\u6c42", "status": "\u8fdb\u884c\u4e2d", "stage": "\u4ea7\u54c1\u627f\u63a5", "basis": "\u8868\u683c\u72b6\u6001\u4e3a\u8fdb\u884c\u4e2d\uff0c\u5148\u6309\u627f\u63a5\u4e2d\u5f55\u5165", "planned": "", "priority": "\u9ad8"},
]


def resolve_belong(name: str) -> str:
    return "TWO_POINT_ZERO" if "2.0" in name else "THREE_POINT_ZERO"


def resolve_status(item: dict[str, str]) -> str:
    return STATUS_MAP[(item["status"], item["stage"])]


def build_stage_rows(current_status: str) -> list[dict[str, object]]:
    if current_status == "PRODUCT_INTAKE":
        reached_count = 2
    elif current_status == "IMPLEMENTATION_DELIVERY":
        reached_count = 3
    else:
        reached_count = 3

    rows = []
    for index, stage_name in enumerate(STAGE_SEQUENCE, start=1):
        reached = index <= reached_count
        rows.append(
            {
                "stageName": stage_name,
                "stageOrder": index,
                "stageReached": 1 if reached else 0,
                "ownerName": CREATED_BY if index == 1 else None,
                "startTime": CREATED_AT if reached else None,
                "endTime": CREATED_AT if current_status == "CLOSED" and reached else None,
                "relatedCustomer": None,
                "outputProductRequirement": None,
                "outputSolution": None,
                "planCompleted": None,
                "deliveryCompleted": "YES" if current_status == "CLOSED" and stage_name == "IMPLEMENTATION_DELIVERY" else None,
                "feedbackStatus": "FEEDBACK_RECEIVED" if current_status == "CLOSED" and stage_name == "IMPLEMENTATION_DELIVERY" else None,
                "feedbackContent": None,
                "includeNextProduct": None,
                "targetProduct": None,
                "durationValue": 1 if reached else None,
                "durationIsManual": 0,
                "updatedAt": CREATED_AT,
            }
        )
    return rows


def main() -> None:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    existing_names = {row[0] for row in cur.execute("select requirementName from requirements")}
    max_requirement_no = cur.execute("select coalesce(max(requirementNo), 1000) from requirements").fetchone()[0]

    inserted = []
    skipped = []

    for item in DATA:
        name = item["name"]
        if name in existing_names:
            skipped.append(name)
            continue

        max_requirement_no += 1
        requirement_no = max_requirement_no
        current_status = resolve_status(item)
        is_finished = 1 if current_status == "CLOSED" else 0

        cur.execute(
            """
            insert into requirements (
              requirementNo, createdAt, requirementName, requirementType, requirementBelong,
              priority, currentStatus, currentOwner, relatedProject, createdBy,
              relatedCustomer, isFinished, totalDurationValue, totalDurationIsManual, updatedAt
            ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                requirement_no,
                CREATED_AT,
                name,
                TYPE_MAP[item["type"]],
                resolve_belong(name),
                PRIORITY_MAP[item["priority"]],
                current_status,
                None,
                None,
                CREATED_BY,
                None,
                is_finished,
                1,
                0,
                CREATED_AT,
            ),
        )
        requirement_id = cur.lastrowid

        for stage in build_stage_rows(current_status):
            cur.execute(
                """
                insert into requirement_stages (
                  requirementId, stageName, stageOrder, stageReached, ownerName, startTime, endTime,
                  relatedCustomer, outputProductRequirement, outputSolution, planCompleted, deliveryCompleted,
                  feedbackStatus, feedbackContent, includeNextProduct, targetProduct,
                  durationValue, durationIsManual, updatedAt
                ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    requirement_id,
                    stage["stageName"],
                    stage["stageOrder"],
                    stage["stageReached"],
                    stage["ownerName"],
                    stage["startTime"],
                    stage["endTime"],
                    stage["relatedCustomer"],
                    stage["outputProductRequirement"],
                    stage["outputSolution"],
                    stage["planCompleted"],
                    stage["deliveryCompleted"],
                    stage["feedbackStatus"],
                    stage["feedbackContent"],
                    stage["includeNextProduct"],
                    stage["targetProduct"],
                    stage["durationValue"],
                    stage["durationIsManual"],
                    stage["updatedAt"],
                ),
            )

        existing_names.add(name)
        inserted.append(name)

    conn.commit()
    conn.close()

    print({"inserted": len(inserted), "skipped": len(skipped)})
    if skipped:
        print({"skipped_names": skipped})


if __name__ == "__main__":
    main()
