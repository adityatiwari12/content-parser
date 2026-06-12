import os
import sys
import threading

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))


def dispatch_task(task_name: str, job_id: str) -> None:
    def _run_sync():
        from services.workers.tasks import run_job_sync
        run_job_sync(job_id, task_name)

    try:
        from services.workers.tasks import (
            run_compliance_job,
            run_gap_analysis_job,
            run_literature_review_job,
            run_peer_review_job,
            run_semantic_analysis_job,
            run_writing_job,
        )
        tasks = {
            "writing": run_writing_job,
            "semantic_analysis": run_semantic_analysis_job,
            "compliance": run_compliance_job,
            "literature_review": run_literature_review_job,
            "gap_analysis": run_gap_analysis_job,
            "peer_review": run_peer_review_job,
        }
        task = tasks.get(task_name)
        if task:
            try:
                task.delay(job_id)
                return
            except Exception:
                pass
    except Exception:
        pass

    threading.Thread(target=_run_sync, daemon=True).start()
