# NodeJS/Express Micro-services

Choosing which architecture is right for your project is a very complex task. Complexity, flexibility, size, time frames, diversity of the team and specific conditions of the project are just some of the factors that need to be considered when deciding which software architecture is the best for your project.

Microservices architecture is a distrubuted system of single self-contained units, and  an approach to application development in which a large application is built as a suite of modular services. Each module supports a specific business goal and uses a simple, well-defined interface to communicate with other sets of services.

By splitting your app into small units every part of it is independently deployable and scalable, can be written by different teams and in different programming languages and can be tested individually.

The micro-service  applications is capable of running in their own memory space and scale independently from each other across potentially many separate machines. 

When you choose to build your application as a set of microservices, you need to decide how your application’s clients will interact with the microservices. With a monolithic application there is just one set of (typically replicated, load‑balanced) endpoints. In a microservices architecture, however, each microservice exposes a set of what are typically fine‑grained endpoints.

Services must handle requests from the application’s clients. Furthermore, services must sometimes collaborate to handle those requests. They must use an inter-process communication protocol for translations and forwarding requests. Use asynchronous non-blocking messaging for inter-service communication. Services communicating by exchanging messages over messaging channels. Examples of asynchronous messaging technologies are Apache Kafka (Event Driven) and RabbitMQ (Messaging). Communication can also be established using REST.

Snapshots

1. Monolithic to Miccro-services - https://github.com/kukuu/Microservice-NodeJS/tree/master/microservice-snapshots 
2. Orchestrating with Kubernetes - https://github.com/kukuu/Microservice-NodeJS/tree/master/kubernetes


## This pattern has the following benefits

- Loose coupling since it decouples clients from services

- Improved availability since the message broker buffers messages until the consumer is able to process them

- Supports a variety of communication patterns including request/reply, notifications, request/async response, publish/subscribe, publish/async response etc


## Reasons to move away from Monolithic

https://github.com/kukuu/Microservice-NodeJS/blob/master/microservice-snapshots/1.png



## Challenges to Micro-services

Microservices enforce loose coupling, plus it’s easier to develop fast and reliable deployment pipelines if they only have to handle small packages.

However, note microservices introduced a new problem: if adding a feature was often going to require adding a new, independently deployed and hosted service then that process had to be fast and not require any specialist knowledge. 

Demanding that every single developer in the company learn the intricacies of maintaining Puppet configuration for all their services would have been impractical and more than a little cruel.

Resolution:

	1.	Set up feature teams  that can possibly set up a new service in under four hours. 
	        What this means
		is Developing services should not   require knowledge of the infrastructure and 
		changing infrastructure should not require detailed knowledge of the services 
		running on it. 
		If we need to change the hostname or port a service runs on it should require 
		no changes to the service itself.

	2.	All project configuration—from build process to health monitoring—must be contained 
	        within the project repository. Anything else introduces hidden dependencies for 
		deployment that threaten to break the pipeline and require specialist 
		knowledge to debug.

	3.	The above configuration should be declarative and not require adding dependencies 
	         to the project.

	4.      Use Containerisation


#### Direct Client‑to‑Microservice Communication

In theory, a client could make requests to each of the microservices directly. Each microservice would have a public endpoint (https://serviceName.api.company.name). This URL would map to the microservice’s load balancer, which distributes requests across the available instances. To retrieve the product details, the mobile client would make requests to each of the services listed above.

Unfortunately, there are challenges and limitations with this option. 

1. One problem is the mismatch between the needs of the client and the fine‑grained APIs exposed by each of the microservices. The client in this example has to make posibly a number of separate requests. In more complex applications it might have to make many more.  While a client could make that many requests over a LAN, it would probably be too inefficient over the public Internet and would definitely be impractical over a mobile network. This approach also makes the client code much more complex.

2. Another problem with the client directly calling the microservices is that some might use protocols that are not web‑friendly. One service might use Thrift binary RPC while another service might use the AMQP messaging protocol. Neither protocol is particularly browser‑ or firewall‑friendly and is best used internally. An application should use protocols such as HTTP and WebSocket outside of the firewall.

3. Another drawback with this approach is that it makes it difficult to refactor the microservices. Over time we might want to change how the system is partitioned into services. For example, we might merge two services or split a service into two or more services. If, however, clients communicate directly with the services, then performing this kind of refactoring can be extremely difficult.
Because of these kinds of problems it rarely makes sense for clients to talk directly to microservices.


#### Resolving micro service complexity  with an API Gateway

Usually a much better approach is to use what is known as an API Gateway. An API Gateway is a server (Serving as an interface) that is the single entry point into the system. It is similar to the Facade pattern from object‑oriented design. The API Gateway encapsulates the internal system architecture and provides an API that is tailored to each client. It might have other responsibilities such as authentication, monitoring, load balancing, caching, request shaping and management, and static response handling.

The Facade design pattern is often used when a system is very complex or difficult to understand because the system has a large number of interdependent classes or its source code is unavailable. This pattern hides the complexities of the larger system and provides a simpler interface to the client. It typically involves a single wrapper class that contains a set of members required by client. These members access the system on behalf of the facade client and hide the implementation details.

1. The API Gateway is responsible for request routing, composition, and protocol translation. All requests from clients first go through the API Gateway. It then routes requests to the appropriate microservice. 

2. The API Gateway will often handle a request by invoking multiple microservices and aggregating the results. It can translate between web protocols such as HTTP and WebSocket and web‑unfriendly protocols that are used internally.

3. The API Gateway can also provide each client with a custom API. It typically exposes a coarse‑grained API for mobile clients. Consider, for example, the product details scenario. The API Gateway can provide an endpoint (/productdetails?productid=xxx) that enables a mobile client to retrieve all of the product details with a single request. The API Gateway handles the request by invoking the various services – product info, recommendations, reviews, etc. – and combining the results.

### Benefits and Drawbacks of an API Gateway

Using an API Gateway has both benefits and drawbacks. 

Benefit:  A major benefit of using an API Gateway is that it encapsulates the internal structure of the application. Rather than having to invoke specific services, clients simply talk to the gateway. The API Gateway provides each kind of client with a specific API. This reduces the number of round trips between the client and application. It also simplifies the client code.

Drawback: The API Gateway also has some drawbacks. It is yet another highly available component that must be developed, deployed, and managed. There is also a risk that the API Gateway becomes a development bottleneck. Developers must update the API Gateway in order to expose each microservice’s endpoints. It is important that the process for updating the API Gateway be as lightweight as possible. Otherwise, developers will be forced to wait in line in order to update the gateway.


#### Implementing an API Gateway

Various design issues you need to consider.

##### Performance and Scalability

Only a handful of companies operate at the scale of Netflix and need to handle billions of requests per day. However, for most applications the performance and scalability of the API Gateway is usually very important. It makes sense, therefore, to build the API Gateway on a platform that supports asynchronous, nonblocking I/O. There are a variety of different technologies that can be used to implement a scalable API Gateway. 

On the JVM you can use one of the NIO‑based frameworks such Netty, Vertx, Spring Reactor, or JBoss Undertow. One popular non‑JVM option is Node.js, which is a platform built on Chrome’s JavaScript engine. Another option is to use NGINX Plus. NGINX Plus offers a mature, scalable, high‑performance web server and reverse proxy that is easily deployed, configured, and programmed. NGINX Plus can manage authentication, access control, load balancing requests, caching responses, and provides application‑aware health checks and monitoring.

##### Using a Reactive Programming Model

The API Gateway handles some requests by simply routing them to the appropriate backend service. It handles other requests by invoking multiple backend services and aggregating the results. With some requests, such as a product details request, the requests to backend services are independent of one another. 

In order to minimize response time, the API Gateway should perform independent requests concurrently. Sometimes, however, there are dependencies between requests. The API Gateway might first need to validate the request by calling an authentication service, before routing the request to a backend service. Similarly, to fetch information about the products in a customer’s wish list, the API Gateway must first retrieve the customer’s profile containing that information, and then retrieve the information for each product.

Writing API composition code using the traditional asynchronous callback approach quickly leads you to callback hell. The code will be tangled, difficult to understand, and error‑prone. A much better approach is to write API Gateway code in a declarative style using a reactive approach. Examples of reactive abstractions include Future in Scala, CompletableFuture in Java 8, and Promise in JavaScript. There is also Reactive Extensions (also called Rx or ReactiveX), which was originally developed by Microsoft for the .NET platform. Netflix created RxJava for the JVM specifically to use in their API Gateway. There is also RxJS for JavaScript, which runs in both the browser and Node.js. Using a reactive approach will enable you to write simple yet efficient API Gateway code.

##### Service Invocation

A microservices‑based application is a distributed system and must use an inter‑process communication mechanism. There are two styles of inter‑process communication. One option is to use an asynchronous, messaging‑based mechanism. Some implementations use a message broker such as JMS or AMQP.

Others, such as Zeromq, are brokerless and the services communicate directly. The other style of inter‑process communication is a synchronous mechanism such as HTTP or Thrift. A system will typically use both asynchronous and synchronous styles. It might even use multiple implementations of each style. Consequently, the API Gateway will need to support a variety of communication mechanisms (Websocket etc). 

##### Service Discovery

The API Gateway needs to know the location (IP address and port) of each microservice with which it communicates. In a traditional application, you could probably hardwire the locations, but in a modern, cloud‑based microservices application this is a nontrivial problem. Infrastructure services, such as a message broker, will usually have a static location, which can be specified via OS environment variables. 

However, determining the location of an application service is not so easy. Application services have dynamically assigned locations. Also, the set of instances of a service changes dynamically because of autoscaling and upgrades. Consequently, the API Gateway, like any other service client in the system, needs to use the system’s service discovery mechanism: either Server‑Side Discovery or Client‑Side Discovery. 

##### Handling Partial Failures

Another issue you have to address when implementing an API Gateway is the problem of partial failure. This issue arises in all distributed systems whenever one service calls another service that is either responding slowly or is unavailable. 

The API Gateway should never block indefinitely waiting for a downstream service. However, how it handles the failure depends on the specific scenario and which service is failing. For example, if the recommendation service of the application is unresponsive in the product details scenario, the API Gateway should return the rest of the product details to the client since they are still useful to the user. The recommendations could either be empty or replaced by, for example, a hardwired top ten list. 

If, however, the product information service is unresponsive then API Gateway should return an error to the client.


The API Gateway could also return cached data if that was available. The data can be cached by the API Gateway itself or be stored in an external cache such as Redis or Memcached. By returning either default data or cached data, the API Gateway ensures that system failures do not impact the user experience.

A very good robust and scalable API Gateway must time out calls that exceed the specified threshold. It implements a circuit breaker pattern, which stops the client from waiting needlessly for an unresponsive service, can be added to the model's implementation. If the error rate for a service exceeds a specified threshold, it could trip a circuit breaker and all requests will fail immediately for a specified period of time. The module should define a fallback action when a request fails, such as reading from a cache or returning a default value. 

For most microservices‑based applications, it makes sense to implement an API Gateway, which acts as a single entry point into a system. The API Gateway is responsible for request routing, composition, and protocol translation. It provides each of the application’s clients with a custom API. The API Gateway can also mask failures in the backend services by returning cached or default data. 


#### Summary

Pros:
```
1. The application starts faster, which makes developers more productive, and speeds
   up deployments.

2. Each service can be deployed independently of other services — easier to deploy new 
   versions of services frequently

3. Easier to scale development and can also have performance advantages.

4. Eliminates any long-term commitment to a technology stack. When developing a new service
   you can pick a new technology stack.

5. Microservices are typically better organized, since each microservice has a very specific job,
and is not concerned with the jobs of other components.

6. Decoupled services are also easier to recompose and reconfigure to serve the purposes of 
   different apps (for example, serving both the web clients and public API).

```

Cons:
```
1. Developers must deal with the additional complexity of creating a distributed system.

2. Deployment complexity. In production, there is also the operational complexity of deploying 
   and managing a system comprised of many different service types.

3. As you’re building a new microservice architecture, you’re likely to discover lots of 
   cross-cutting concerns that you did not anticipate at design time.

```

### Deploying Micro -services

Containers or Severless

- https://github.com/kukuu/AGILITY/tree/master/white-paper/severlessComputing-vs-containers
