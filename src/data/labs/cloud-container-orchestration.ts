import type { LabManifest } from "../../types/manifest";

export const labManifest: LabManifest = {
  schemaVersion: "1.1",
  id: "cloud-container-orchestration",
  version: 1,
  title: "Troubleshoot Container Deployment Issues",
  tier: "advanced",
  track: "virtualization-cloud",
  difficulty: "challenging",
  accessLevel: "premium",
  tags: ["containers", "docker", "kubernetes", "orchestration", "troubleshooting", "CompTIA-A+"],
  description:
    "Triage and remediate container deployment failures in orchestration platforms by analyzing logs, configuration errors, and resource constraints.",
  estimatedMinutes: 22,
  learningObjectives: [
    "Interpret container runtime errors and orchestration platform logs",
    "Diagnose common container deployment failures including image pull errors and resource limits",
    "Remediate container networking and service discovery issues",
    "Apply container health check and restart policies correctly",
  ],
  sortOrder: 412,
  status: "published",
  prerequisites: [],
  rendererType: "triage-remediate",
  scenarios: [
    {
      id: "co-scenario-1",
      type: "triage-remediate",
      title: "Pods Stuck in CrashLoopBackOff",
      description:
        "A deployment of 3 replica pods for a Node.js API service went out this morning. All 3 pods are in CrashLoopBackOff status with increasing restart counts. The previous version was running fine. Users are reporting 503 Service Unavailable errors.",
      evidence: [
        {
          type: "log",
          content:
            "kubectl logs api-service-7d4f8b-x2k9j: 'Error: connect ECONNREFUSED 10.96.45.12:5432 - PostgreSQL connection failed. Environment variable DATABASE_URL is undefined. Exiting with code 1.' Pod restarts: 8 in last 15 minutes.",
        },
        {
          type: "config",
          content:
            "kubectl describe pod api-service-7d4f8b-x2k9j shows: Container image: api-service:v2.3.0 (pulled successfully). Environment variables: NODE_ENV=production, PORT=3000. No DATABASE_URL variable present. The previous deployment (v2.2.0) used a ConfigMap 'api-config' that included DATABASE_URL.",
        },
        {
          type: "diff",
          content:
            "Diff between v2.2.0 and v2.3.0 deployment YAML: The envFrom section referencing ConfigMap 'api-config' was accidentally deleted in the v2.3.0 deployment manifest. The ConfigMap 'api-config' still exists in the cluster with the correct DATABASE_URL value.",
        },
      ],
      classifications: [
        {
          id: "co1-c1",
          label: "Image Pull Failure",
          description: "The container image cannot be pulled from the registry",
        },
        {
          id: "co1-c2",
          label: "Missing Configuration Reference",
          description: "The deployment manifest is missing a ConfigMap or Secret reference that provides required environment variables",
        },
        {
          id: "co1-c3",
          label: "Database Server Down",
          description: "The PostgreSQL database service is unreachable due to a database outage",
        },
      ],
      correctClassificationId: "co1-c2",
      remediations: [
        {
          id: "co1-rem1",
          label: "Restore the envFrom ConfigMap reference in the deployment manifest and redeploy",
          description: "Add the envFrom section referencing the api-config ConfigMap back to the v2.3.0 deployment YAML and apply it",
        },
        {
          id: "co1-rem2",
          label: "Restart the PostgreSQL database pod to fix the connection issue",
          description: "Delete the PostgreSQL pod to trigger a restart and resolve the connection refusal",
        },
        {
          id: "co1-rem3",
          label: "Roll back to v2.2.0 and investigate later",
          description: "Execute kubectl rollout undo to revert to the previous working deployment immediately",
        },
      ],
      correctRemediationId: "co1-rem1",
      rationales: [
        {
          id: "co1-r1",
          text: "The logs show DATABASE_URL is undefined, not that the database is down. The deployment diff confirms the ConfigMap reference was accidentally removed. The ConfigMap still exists, so restoring the reference fixes the root cause.",
        },
        {
          id: "co1-r2",
          text: "Restoring the envFrom reference is the correct forward-fix because it addresses the root cause (missing config reference) while keeping the v2.3.0 code changes. Rolling back works as emergency mitigation but delays delivering the v2.3.0 changes and does not fix the manifest bug.",
        },
      ],
      correctRationaleId: "co1-r2",
      feedback: {
        perfect:
          "Excellent troubleshooting. You traced the ECONNREFUSED error back to a missing environment variable, identified the manifest diff as the root cause, and applied the correct forward-fix.",
        partial:
          "Rolling back works as an emergency stop but does not fix the underlying manifest issue. The v2.3.0 deployment will fail again next time.",
        wrong: "The database is not down. The error is caused by a missing environment variable, not a database service failure.",
      },
    },
    {
      id: "co-scenario-2",
      type: "triage-remediate",
      title: "Container OOMKilled Repeatedly",
      description:
        "A Java Spring Boot application container keeps getting OOMKilled (Out of Memory Killed) by Kubernetes after running for approximately 20 minutes. The application handles batch data processing jobs that load large datasets into memory.",
      evidence: [
        {
          type: "log",
          content:
            "kubectl describe pod batch-processor-5c8d9-m3k2j: Last State: Terminated, Reason: OOMKilled, Exit Code: 137. Container memory limit: 512Mi. Java process heap dump shows: -Xmx256m set in Dockerfile, but actual heap usage peaked at 490 MB due to off-heap memory (Metaspace, thread stacks, NIO buffers) consuming an additional 234 MB beyond the heap.",
        },
        {
          type: "metrics",
          content:
            "Prometheus shows container memory usage climbs linearly from 200 MB at startup to 512 MB over 20 minutes, hitting the Kubernetes memory limit. The Java heap stays within 256 MB but total JVM memory (heap + non-heap) exceeds the container limit. Node has 16 GB available memory.",
        },
        {
          type: "config",
          content:
            "Deployment YAML: resources.limits.memory: 512Mi, resources.requests.memory: 256Mi. Dockerfile: ENV JAVA_OPTS='-Xmx256m -Xms128m'. No MaxMetaspaceSize or MaxDirectMemorySize JVM flags set. The application processes CSV files ranging from 50 MB to 200 MB, loading entire files into memory.",
        },
      ],
      classifications: [
        {
          id: "co2-c1",
          label: "Memory Leak in Application Code",
          description: "The Java application has a memory leak causing unbounded memory growth",
        },
        {
          id: "co2-c2",
          label: "JVM-to-Container Memory Mismatch",
          description: "The JVM total memory (heap + non-heap) exceeds the Kubernetes container memory limit",
        },
        {
          id: "co2-c3",
          label: "Kubernetes Node Memory Exhaustion",
          description: "The cluster node is running out of memory, causing pod evictions",
        },
      ],
      correctClassificationId: "co2-c2",
      remediations: [
        {
          id: "co2-rem1",
          label: "Increase container memory limit to 1 Gi and set JVM flags: -Xmx512m -XX:MaxMetaspaceSize=128m -XX:MaxDirectMemorySize=64m",
          description: "Align the container limit with total JVM memory requirements and cap non-heap memory regions explicitly",
        },
        {
          id: "co2-rem2",
          label: "Set container memory limit to 4 Gi to give maximum headroom",
          description: "Increase the memory limit dramatically to prevent any OOM events",
        },
        {
          id: "co2-rem3",
          label: "Add swap space to the container to handle memory overflow",
          description: "Enable swap inside the container to prevent OOMKill when memory limits are reached",
        },
      ],
      correctRemediationId: "co2-rem1",
      rationales: [
        {
          id: "co2-r1",
          text: "The JVM uses memory beyond the heap: Metaspace for class metadata, thread stacks, NIO direct buffers, and GC overhead. The container limit must account for total JVM memory, not just the heap. Setting explicit caps on non-heap regions (-XX:MaxMetaspaceSize, -XX:MaxDirectMemorySize) prevents unbounded growth.",
        },
        {
          id: "co2-r2",
          text: "A 1 Gi container limit with properly sized JVM flags (512m heap + 128m Metaspace + 64m DirectMemory + ~200m overhead) fits within 1 Gi while leaving room for the OS and JVM overhead. This is right-sized rather than wastefully overprovisioned at 4 Gi.",
        },
      ],
      correctRationaleId: "co2-r1",
      feedback: {
        perfect:
          "Excellent diagnosis. You identified the JVM-container memory mismatch and applied proper JVM flags to cap total memory usage within the container limit.",
        partial:
          "Increasing the limit works but without capping JVM non-heap regions, memory could grow unbounded and trigger OOMKill again at higher thresholds.",
        wrong: "The issue is not a code leak or node exhaustion. The JVM total memory footprint simply exceeds what Kubernetes allocated to the container.",
      },
    },
    {
      id: "co-scenario-3",
      type: "triage-remediate",
      title: "Service Mesh Routing Failure After Deployment",
      description:
        "After deploying a new version (v3.0) of the payment service alongside the existing v2.0, customers are intermittently getting 500 errors on checkout. The v3.0 containers are healthy but some requests fail. Both versions are receiving traffic.",
      evidence: [
        {
          type: "log",
          content:
            "Payment service v3.0 logs: 'POST /api/v2/charge - 500 Internal Server Error: Cannot read property processPayment of undefined'. Payment service v2.0 logs: 'POST /api/v2/charge - 200 OK'. The v3.0 code refactored the payment module and the API endpoint changed from /api/v2/charge to /api/v3/charge. The old /api/v2/charge route was removed in v3.0.",
        },
        {
          type: "config",
          content:
            "Kubernetes Service 'payment-service' selector matches both v2.0 and v3.0 pods (label: app=payment-service). No Istio VirtualService or DestinationRule is configured for traffic splitting. The Service round-robins requests between all matching pods regardless of version. The checkout frontend hardcodes calls to /api/v2/charge.",
        },
        {
          type: "metrics",
          content:
            "Grafana dashboard shows: 50% of checkout requests succeed (hitting v2.0 pods), 50% fail with 500 errors (hitting v3.0 pods). Error rate appeared exactly when v3.0 deployment scaled to 3 replicas, matching the v2.0 replica count. No errors existed before v3.0 deployment.",
        },
      ],
      classifications: [
        {
          id: "co3-c1",
          label: "Breaking API Change Without Traffic Management",
          description: "A new version with incompatible API routes receives production traffic without proper traffic splitting or versioned routing",
        },
        {
          id: "co3-c2",
          label: "Container Health Check Failure",
          description: "The v3.0 pods are failing health checks and should be removed from the service",
        },
        {
          id: "co3-c3",
          label: "Database Schema Migration Failure",
          description: "The v3.0 code requires a database schema change that was not applied",
        },
      ],
      correctClassificationId: "co3-c1",
      remediations: [
        {
          id: "co3-rem1",
          label: "Configure Istio VirtualService to route 100% traffic to v2.0, then gradually shift to v3.0 with the updated frontend",
          description: "Implement canary deployment with traffic splitting: immediately stop v3.0 from receiving v2 API traffic, update frontend to call v3 API, then shift traffic gradually",
        },
        {
          id: "co3-rem2",
          label: "Scale v3.0 deployment to 0 replicas to stop the errors immediately",
          description: "Remove all v3.0 pods to eliminate the 500 errors and revert to v2.0 only",
        },
        {
          id: "co3-rem3",
          label: "Add the /api/v2/charge route back to v3.0 as an alias for /api/v3/charge",
          description: "Make v3.0 backward compatible by adding a route alias that maps old URLs to new handlers",
        },
      ],
      correctRemediationId: "co3-rem1",
      rationales: [
        {
          id: "co3-r1",
          text: "The root cause is that v3.0 has a breaking API change and the Kubernetes Service sends traffic to both versions without discrimination. Istio traffic splitting enables controlled rollout: immediately route all traffic to v2.0 to stop errors, then migrate traffic to v3.0 after the frontend is updated.",
        },
        {
          id: "co3-r2",
          text: "Traffic management with a VirtualService is the proper solution because it enables canary deployments for future releases. Scaling to 0 is a quick fix but does not solve the deployment process problem. Adding route aliases creates technical debt.",
        },
      ],
      correctRationaleId: "co3-r1",
      feedback: {
        perfect:
          "Correct. You identified the breaking API change without traffic management as the root cause and implemented proper canary deployment with Istio to control the rollout.",
        partial:
          "Scaling down v3.0 or adding backward compatibility stops the bleeding but does not establish the proper deployment practice to prevent this from happening again.",
        wrong: "The pods are healthy. The issue is a routing and API compatibility problem, not a health check or database issue.",
      },
    },
  ],
  hints: [
    "When pods crash, always read the container logs first. The exit code and error message usually point directly to the root cause.",
    "JVM containers need memory limits that account for heap PLUS non-heap memory (Metaspace, thread stacks, direct buffers).",
    "When deploying new versions alongside old ones, ensure the Kubernetes Service or a traffic management tool routes traffic to the correct version.",
  ],
  scoring: {
    maxScore: 100,
    hintPenalty: 5,
    penalties: { perfect: 0, partial: 10, wrong: 20 },
    passingThresholds: { pass: 70, partial: 40 },
  },
  careerInsight:
    "Container orchestration troubleshooting is a must-have skill for DevOps and cloud engineering roles. Kubernetes is the industry standard for container orchestration, and knowing how to diagnose CrashLoopBackOff, OOMKilled, and routing issues is expected knowledge in technical interviews.",
  toolRelevance: [
    "kubectl CLI",
    "Docker CLI",
    "Kubernetes Dashboard",
    "Prometheus / Grafana",
    "Istio Service Mesh",
  ],
  createdAt: "2026-03-27T00:00:00Z",
  updatedAt: "2026-03-27T00:00:00Z",
};
