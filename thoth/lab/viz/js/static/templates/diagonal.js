/**
 * Static diagonal hierarchical layout
 *
 * @module
 * @author Marek Cermak <macermak@redhat.com>
 */

const margin = { top: 80, right: 20, bottom: 80, left: 20 };

// svg proportions
const width  = $$('#notebook-container').width() - 120;  // jupyter notebook margin
const height = 640;

const radius = 11;
const offset = 1.618 * radius;


$$(element).empty();  // clear output

require(['d3', 'd3-hierarchy'], (d3, d3_hierarchy) => {

    const data = d3.csvParse(`$data`); console.log(data);

    let root = d3.stratify()
        .id( d => d.target)
        .parentId( d => d.source)
        (data);

    let cluster = d3.cluster()
        .size([
            width  - margin.right   - margin.left,
            height - margin.top - margin.bottom
        ]);

    cluster(root); console.log("Root: ", root);

    let svg = d3.select(element.get(0)).append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(0, $${margin.top})`);

    let nodes = svg.append('g').attr('class', 'nodes'),
        links = svg.append('g').attr('class', 'links');

    // node circles
    nodes
        .selectAll('circle.node')
        .data(root.descendants())
        .enter()
        .append('circle')
        .attr('class', 'node')
        .attr('cx', d => d.x )
        .attr('cy', d => d.y )
        .attr('r', radius);

    // node text
    nodes
        .selectAll('text.node')
        .data(root.descendants())
        .enter()
        .append('text')
        .attr('class', 'node')
        .attr('x', d => d.x )
        .attr('y', d => d.y )
        .attr('dx', d => d.children ? 1.25 * offset : "" )
        .attr('dy', d => d.children ? ".25em" : radius + 1.25 * offset )
        .attr("text-anchor", d => d.children ? "right" : "middle")
        .text( d => d.id /* d.data.name */ );

    links
        .selectAll('line.link')
        .data(root.links())
        .enter()
        .append('line')
        .attr('class', 'link')
        .attr('x1', d => d.source.x )
        .attr('y1', d => d.source.y + offset )
        .attr('x2', d => d.target.x )
        .attr('y2', d => d.target.y - offset );

    console.log("Nodes: ", nodes);
    console.log("Links: ", links);

});